'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { generateSuggestions } from '../utils/generateSuggestions'
import type { Schedule, Presenter } from '../types'
import { playSound } from '../utils/sound'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import React from 'react'
const { jsx, jsxs } = React

const STATIONS = [
  "YAHWEH'S", "WAVETIME", "SHAHADA", "MADHABAHU1", "JAWABU1", "MAAJABU",
  "VENUS SIGNET", "JAWABU2", "MADHABAHU 2", "VENUS PANG", "SHAHADA 2", "WAVETIME 2"
]

const TIME_SLOTS = [
  "7:00 AM-10:30am", "10:30 AM-1:00pm", "1:00PM-3:30pm",
  "3:30 PM-6:00pm", "6:00 PM-8:30pm", "8:30 PM-12:00am"
]

interface TimetableProps {
  soundEnabled: boolean;
  presenters: Presenter[];
}

export default function Timetable({ soundEnabled, presenters }: TimetableProps) {
  const [startDate, setStartDate] = useState(new Date())
  const [schedule, setSchedule] = useState<Schedule>(() => {
    const savedSchedule = localStorage.getItem('schedule')
    return savedSchedule ? JSON.parse(savedSchedule) : generateSuggestions(presenters, startDate)
  })
  const [isFullView, setIsFullView] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const timetableRef = useRef<HTMLDivElement>(null)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 2)

  const days = useMemo(() => {
    const result = []
    const currentDate = new Date(startDate)
    for (let i = 0; i < 3; i++) {
      result.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return result
  }, [startDate])

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule))
  }, [schedule])

  useEffect(() => {
    setSchedule(generateSuggestions(presenters, startDate))
  }, [presenters, startDate])

  const handlePresenterChange = (day: string, timeSlot: string, stationIndex: number, presenterName: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule }
      if (!newSchedule[day]) newSchedule[day] = {}
      if (!newSchedule[day][timeSlot]) newSchedule[day][timeSlot] = []
      newSchedule[day][timeSlot][stationIndex] = presenterName
      return newSchedule
    })

    if (soundEnabled) {
      playSound('click')
    }
  }

  const handleRefresh = () => {
    setSchedule(generateSuggestions(presenters, startDate))
    if (soundEnabled) {
      playSound('refresh')
    }
  }

  const handleDateChange = (date: Date) => {
    setStartDate(date)
  }

  const captureTable = async (fullCapture: boolean = false) => {
    let clone: HTMLElement | null = null;
    
    try {
      if (!timetableRef.current) {
        throw new Error('Timetable element not found');
      }

      const timetableElement = timetableRef.current;
      
      // Create a clone for capture
      clone = timetableElement.cloneNode(true) as HTMLElement;
      
      // Create a wrapper div with specific styles
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.width = `${timetableElement.offsetWidth}px`;
      wrapper.style.background = 'white';
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);
      
      // Process all select elements before capture
      const cells = clone.querySelectorAll('td');
      cells.forEach(cell => {
        const selectContainer = cell.querySelector('[data-cell-content]');
        if (selectContainer) {
          const selectButton = selectContainer.querySelector('button');
          if (selectButton) {
            const value = selectButton.textContent?.trim() || 'Select';
            const div = document.createElement('div');
            div.textContent = value;
            div.style.padding = '8px';
            div.style.fontSize = '14px';
            div.style.fontWeight = '500';
            div.style.textAlign = 'center';
            div.style.width = '100%';
            div.style.minHeight = '32px';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            
            // Replace the entire select container with the new div
            const parent = selectContainer.parentElement;
            if (parent) {
              parent.innerHTML = '';
              parent.appendChild(div);
            }
          }
        }
      });

      // Wait for any potential reflows
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        width: wrapper.offsetWidth,
        height: wrapper.scrollHeight,
        onclone: (clonedDoc) => {
          const styles = document.createElement('style');
          styles.textContent = `
            table { border-collapse: collapse; width: 100%; }
            td, th { 
              border: 1px solid #e2e8f0;
              padding: 8px;
              text-align: center;
              min-width: 120px;
            }
            th { background-color: #1f2937; color: white; }
            tr:first-child th { background-color: #dc2626; }
          `;
          clonedDoc.head.appendChild(styles);
        }
      });

      // Clean up
      document.body.removeChild(wrapper);
      
      return canvas;
    } catch (error) {
      console.error('Capture error:', error);
      if (clone?.parentElement) {
        document.body.removeChild(clone.parentElement);
      }
      throw new Error('Failed to capture table: ' + (error as Error).message);
    }
  };

  const handleDownloadImage = async () => {
    try {
      const canvas = await captureTable();
      if (!canvas) {
        throw new Error('Failed to generate canvas');
      }

      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'timetable.png';
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error('Failed to convert canvas to blob');
          }
        }, 'image/png', 1.0);
      });

      // Create object URL and trigger download
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.click();

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error generating image: ' + (error as Error).message);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const canvas = await captureTable();
      if (!canvas) {
        throw new Error('Failed to generate canvas');
      }

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('timetable.pdf');
    } catch (error) {
      console.error('PDF error:', error);
      alert('Error generating PDF: ' + (error as Error).message);
    }
  };

  const handleFullScreenshot = async () => {
    try {
      const canvas = await captureTable(true);
      if (!canvas) {
        throw new Error('Failed to generate canvas');
      }

      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'full_timetable.png';
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error('Failed to convert canvas to blob');
          }
        }, 'image/png', 1.0);
      });

      // Create object URL and trigger download
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.click();

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Screenshot error:', error);
      alert('Error generating screenshot: ' + (error as Error).message);
    }
  };

  const toggleView = () => {
    setIsFullView(!isFullView);
  };

  const isLevel1OnlyStation = (station: string) => {
    return station === "YAHWEH'S" || station === "WAVETIME";
  };

  const filteredPresenters = useMemo(() => {
    return presenters.filter(presenter => 
      presenter.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [presenters, searchTerm])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Timetable</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2">Start Date:</span>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={toggleView}
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            {isFullView ? "Compact View" : "Full View"}
          </button>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Refresh Suggestions
          </button>
          <button
            onClick={handleDownloadImage}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Download Image
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Download PDF
          </button>
          <button
            onClick={handleFullScreenshot}
            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Full Screenshot
          </button>
        </div>
      </div>
      <div className={`${isFullView ? '' : 'overflow-x-auto'}`} ref={timetableRef}>
        <table className={`w-full border-collapse border border-gray-800 ${isFullView ? 'text-sm' : 'text-xs'}`}>
          {days.map((day, dayIndex) => (
            <tbody key={day.toISOString()}>
              <tr>
                <th 
                  colSpan={13} 
                  className="bg-red-600 text-white p-2 text-center font-bold"
                >
                  {day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </th>
              </tr>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-700 p-2">TIME</th>
                {STATIONS.map((station) => (
                  <th 
                    key={station} 
                    className="border border-gray-700 p-2 whitespace-normal min-w-[120px]"
                  >
                    {station}
                  </th>
                ))}
              </tr>
              {TIME_SLOTS.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="border border-gray-300 p-2 bg-gray-800 text-white whitespace-normal">
                    {timeSlot}
                  </td>
                  {STATIONS.map((station, index) => (
                    <td 
                      key={`${station}-${index}`} 
                      className="border border-gray-300 p-2 min-w-[120px]"
                    >
                      <div className={`w-full ${isFullView ? 'font-bold' : ''}`} data-cell-content>
                        <Select
                          value={schedule[day.toISOString()]?.[timeSlot]?.[index] || ""}
                          onValueChange={(value) => handlePresenterChange(day.toISOString(), timeSlot, index, value)}
                        >
                          <SelectTrigger className="w-full h-8 px-2 text-sm">
                            <SelectValue>
                              {schedule[day.toISOString()]?.[timeSlot]?.[index] || "Select"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <Input
                                placeholder="Search presenters..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-2"
                              />
                            </div>
                            {filteredPresenters
                              .filter(presenter => 
                                isLevel1OnlyStation(station) ? presenter.level === 1 : true
                              )
                              .map((presenter) => (
                                <SelectItem 
                                  key={presenter.phone} 
                                  value={presenter.name}
                                  className="whitespace-normal"
                                >
                                  {presenter.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  )
}

