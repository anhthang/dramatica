import urlMetadata from 'url-metadata'

export default async (url: string) => {
  const metadata = await urlMetadata(url)

  const { irAlbumName: name, jsonld } = metadata

  const information: { [x: string]: any } = {
    name,
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
