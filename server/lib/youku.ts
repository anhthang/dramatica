import urlMetadata from 'url-metadata'

export default async (url: string) => {
  const metadata = await urlMetadata(url)

  const { irAlbumName: name, jsonld } = metadata

  const information: { [x: string]: any } = {
    name,
  }

  const linkedData = jsonld.find((ld: any) => Array.isArray(ld['@graph']))

  if (linkedData) {
    linkedData['@graph'].forEach((data: any) => {
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
