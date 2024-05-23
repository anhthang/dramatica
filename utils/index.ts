import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'

dayjs.extend(duration)

export const runtime2Duration = (seconds?: number) => {
  if (!seconds) return ''

  return seconds > 3600
    ? dayjs.duration(seconds * 1000).format('H[h]m[m]')
    : dayjs.duration(seconds * 1000).format('m[m]')
}

export const isoDuration2Seconds = (isoDuration: string) => {
  const duration = dayjs.duration(isoDuration)

  return duration.asSeconds()
}

export const themeSpecificServices = ['WeTV', 'Youku']

export const roles = {
  cast: ['Main', 'Supporting', 'Special Guest'],
  crew: [
    'Director',
    'Writer',
    'Screenwriter',
    'Producer',
    'Cinematographer',
    'Original Author',
    'Art Director',
    'Makeup Artist',
  ],
}

export const serviceMap: { [x: string]: string } = {
  'wetv.vip': 'WeTV',
  'www.iq.com': 'iQIYI',
  'www.netflix.com': 'Netflix',
  'www.youku.tv': 'Youku',
}

export const toLocalePeopleName = (people: any, locale: string = 'en') => {
  return people[`name_${locale}`] || people.name
}

export const toLocaleCharacterName = (cast: any, locale: string = 'en') => {
  return cast[`character_name_${locale}`] || cast.character_name
}

export const toLocaleDate = (str: string, locale: string = 'en') => {
  return str
    ? new Date(str).toLocaleDateString(locale, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''
}

export const getStreamingService = (url: string) => {
  const { hostname } = new URL(url)

  return serviceMap[hostname]
}
