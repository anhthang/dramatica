import unescape from 'lodash.unescape'
import urlMetadata from 'url-metadata'

export const tv = async (url: string) => {
  const metadata = await urlMetadata(url)

  const { canonical, 'og:image': cover_url, jsonld } = metadata

  const information: { [x: string]: any } = {
    cover_url,
    synopsis_source: 'iQIYI',
    airing_platform: 'iQIYI',
    watch_link: canonical || url,
  }

  if (Array.isArray(jsonld)) {
    jsonld.forEach((data) => {
      switch (data['@type']) {
        case 'VideoObject':
          information.air_date = data.uploadDate.substring(0, 10)
          break
        case 'TVSeries':
          {
            const { name, description, numberOfEpisodes, copyrightYear } = data
            const [title] = name.split(`(${copyrightYear})`)

            const index = description.indexOf('iQ.com')
            const synopsis = description.substring(index + 8)

            Object.assign(information, {
              title: title.trim(),
              synopsis: unescape(synopsis),
              number_of_episodes: Number(numberOfEpisodes),
              release_year: Number(copyrightYear),
            })
          }
          break
        default:
          break
      }
    })
  }

  return information
}
