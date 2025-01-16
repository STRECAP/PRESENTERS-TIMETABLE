import { useState, useEffect } from 'react'

export function useSchedule() {
  const [schedule, setSchedule] = useState({})

  useEffect(() => {
    // Fetch initial schedule from API
    fetch('/api/schedule')
      .then(res => res.json())
      .then(data => setSchedule(data))
  }, [])

  const updateSchedule = (day: number, station: number, timeSlot: string, presenterId: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule }
      if (!newSchedule[day]) newSchedule[day] = {}
      if (!newSchedule[day][station]) newSchedule[day][station] = {}
      newSchedule[day][station][timeSlot] = presenterId
      
      // Update API
      fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule)
      })

      return newSchedule
    })
  }

  return { schedule, updateSchedule }
}

