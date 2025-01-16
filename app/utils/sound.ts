const SOUND_FILES = {
  click: '/sounds/click.mp3',
  refresh: '/sounds/refresh.mp3',
  success: '/sounds/success.mp3',
}

export function playSound(soundName: keyof typeof SOUND_FILES) {
  const audio = new Audio(SOUND_FILES[soundName])
  audio.play().catch(error => {
    console.warn(`Failed to play sound: ${soundName}`, error)
  })
}

