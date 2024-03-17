import urlMetadata from 'url-metadata'

export default async (url: string) => {
  /**
   * It seems WeTV returning images based on IP country
   * We need to fix this to correct poster & backdrop image
   */
  const metadata = await urlMetadata(url)

  const paths = url.split('/')
  const cid = paths[5]

  const { lang: language, 'og:image': backdrop_url, jsonld } = metadata

  const information: { [x: string]: any } = {
    language,
    backdrop_url,
  }

  const linkedData = jsonld.find((ld: any) => Array.isArray(ld['@graph']))

  if (linkedData) {
    linkedData['@graph'].forEach((data: any) => {
      switch (data['@type']) {
        case 'BreadcrumbList':
          if (Array.isArray(data.itemListElement)) {
            const { name } = data.itemListElement.reverse()[0]
            information.name = name
          }
          break

        case 'TVSeries':
          {
            const { description, actor } = data
            if (Array.isArray(actor)) {
              if (Array.isArray(actor[0].name.workInfo)) {
                const workInfo = actor[0].name.workInfo.find(
                  (w: any) => w.cid === cid,
                )
                if (workInfo) {
                  information.poster_url = workInfo.posterVt
                }
              }
            }

            if (language === 'en') {
              const [synopsis] = description.split(' | ')
              information.synopsis = synopsis
            }
          }
          break
        default:
          break
      }
    })
  }

  return information
}
