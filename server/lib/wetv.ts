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
    synopsis_source: 'WeTV',
    airing_platform: 'WeTV',
    watch_link: url,
  }

  if (Array.isArray(jsonld)) {
    jsonld.forEach((data: any) => {
      switch (data['@type']) {
        case 'BreadcrumbList':
          if (Array.isArray(data.itemListElement)) {
            const { name } = data.itemListElement.reverse()[0]
            information.title = name
          }
          break

        case 'TVSeries':
          {
            const { description, actor } = data
            if (Array.isArray(actor)) {
              const workInfos = actor.reduce((out, cur) => {
                out = out.concat(cur.name.workInfo)
                return out
              }, [])

              const workInfo = workInfos.find((w: any) => w.cid === cid)
              if (workInfo) {
                information.poster_url = workInfo.posterVt
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
