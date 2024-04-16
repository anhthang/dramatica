import unescape from 'lodash.unescape'
import urlMetadata from 'url-metadata'

export const tv = async (url: string, language: string) => {
  const urlObj = new URL(url)

  const [, , , path] = urlObj.pathname.split('/')
  const [show_id] = path.split('-')

  const watch_link = `https://wetv.vip/${language}/play/${show_id}`
  const metadata = await urlMetadata(watch_link)

  const { 'og:image': cover_url, jsonld } = metadata

  const information: { [x: string]: any } = {
    cover_url,
    synopsis_source: 'WeTV',
    airing_platform: 'WeTV',
    watch_link: watch_link.replace('/play/', '/album/'),
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

              const workInfo = workInfos.find((w: any) => w.cid === show_id)
              if (workInfo) {
                information.poster_url = workInfo.posterVt
              }
            }

            if (language === 'en') {
              const [synopsis] = description.split(' | ')
              information.synopsis = unescape(synopsis)
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
