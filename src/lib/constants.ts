import type { Flow } from './types'

export const cardioActivities = [
  'Treadmill',
  'Walk',
  'Run',
  'Bike',
  'Elliptical',
  'Stair climber',
  'Swim',
  'Yoga',
  'Pilates',
]

export const feelings = [
  'Happy',
  'Calm',
  'Grateful',
  'Energized',
  'Motivated',
  'Loved',
  'Tired',
  'Anxious',
  'Stressed',
  'Sad',
  'Irritable',
  'Lonely',
]

export const symptoms = [
  'Cramps',
  'Bloating',
  'Headache',
  'Acne',
  'Tender breasts',
  'Fatigue',
  'Cravings',
  'Back pain',
  'Mood swings',
]

export const flows: { value: Flow; label: string }[] = [
  { value: 'spotting', label: 'Spotting' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
]

export const rideFocus = [
  'Flatwork',
  'Jumping',
  'Trail',
  'Lesson',
  'Groundwork',
  'Hack',
  'Show',
]
