import urlMetadata from 'url-metadata'

export default async (url: string) => {
  const metadata = await urlMetadata(url)

  const { irAlbumName: title, jsonld } = metadata

  const information: { [x: string]: any } = {
    title,
    synopsis_source: 'Youku',
    airing_platform: 'Youku',
    watch_link: url,
  }

  if (Array.isArray(jsonld)) {
    jsonld.forEach((data: any) => {
      switch (data['@type']) {
        case 'TVSeries':
          information.synopsis = data.description
          break
        default:
          break
      }
    })
  }

  return information
}
