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

const serviceMap: { [x: string]: string } = {
  'wetv.vip': 'WeTV',
  'www.iq.com': 'iQIYI',
  'www.netflix.com': 'Netflix',
  'www.youku.tv': 'Youku',
}

export const toLocaleDate = (str: string, locale: string = 'en') => {
  return new Date(str).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const getStreamingService = (url: string) => {
  const { hostname } = new URL(url)

  return serviceMap[hostname]
}
