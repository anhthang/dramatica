import unescape from 'lodash.unescape'
import urlMetadata from 'url-metadata'

export const tv = async (url: string) => {
  const metadata = await urlMetadata(url)

  const {
    datePublished,
    irAlbumName: title,
    jsonld,
    url: watch_link,
  } = metadata

  const information: { [x: string]: any } = {
    title,
    synopsis_source: 'Youku',
    airing_platform: 'Youku',
    watch_link,
  }

  if (datePublished) {
    information.air_date = datePublished.substring(0, 10)
    information.release_year = Number(datePublished.substring(0, 4))
  }

  if (Array.isArray(jsonld)) {
    jsonld.forEach((data: any) => {
      switch (data['@type']) {
        case 'TVSeries':
          information.synopsis = unescape(data.description)
          break
        default:
          break
      }
    })
  }

  return information
}
