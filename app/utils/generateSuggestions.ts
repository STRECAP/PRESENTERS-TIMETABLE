import { Schedule, Presenter } from '../types'

const STATIONS = [
  "YAHWEH'S", "WAVETIME", "SHAHADA", "MADHABAHU1", "JAWABU1", "MAAJABU",
  "VENUS SIGNET", "JAWABU2", "MADHABAHU 2", "VENUS PANG", "SHAHADA 2", "WAVETIME 2"
]

const TIME_SLOTS = [
  "7:00 AM-10:30am", "10:30 AM-1:00pm", "1:00PM-3:30pm",
  "3:30 PM-6:00pm", "6:00 PM-8:30pm", "8:30 PM-12:00am"
]

const isLevel1OnlyStation = (station: string) => {
  return station === "YAHWEH'S" || station === "WAVETIME";
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSuggestions(presenters: Presenter[], startDate: Date): Schedule {
  const suggestions: Schedule = {}
  const level1Presenters = presenters.filter(p => p.level === 1)
  const allPresenters = presenters

  for (let i = 0; i < 3; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)
    const day = currentDate.toISOString()

    suggestions[day] = {}
    const dailyAssignments: { [station: string]: string[] } = {}

    STATIONS.forEach(station => {
      const availablePresenters = isLevel1OnlyStation(station) ? level1Presenters : allPresenters
      dailyAssignments[station] = shuffleArray(availablePresenters).map(p => p.name)
    })

    TIME_SLOTS.forEach((timeSlot, slotIndex) => {
      suggestions[day][timeSlot] = STATIONS.map(station => {
        const assigned = dailyAssignments[station][slotIndex % dailyAssignments[station].length]
        return assigned
      })
    })
  }

  return suggestions
}

