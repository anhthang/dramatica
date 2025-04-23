import unescape from 'lodash.unescape'
import xpath from 'xpath-html'

const regex = /<use[^>]*>(.*?)<\/use>/g

const scraper = async (url: string, language: string) => {
  const urlObj = new URL(url)

  const [, , , path] = urlObj.pathname.split('/')
  const [show_id] = path.split('-')

  const watch_link = `https://wetv.vip/${language}/play/${show_id}`

  let html = await fetch(watch_link).then((res) => res.text())

  // to remove href redefined tags
  html = html.replace(regex, '')

  const node = xpath
    .fromPageSource(html)
    .findElement('//script[@id="__NEXT_DATA__"]')

  try {
    const data = JSON.parse(node.getText())

    return JSON.parse(data.props.pageProps.data)
  } catch (_error) {
    console.log('unable to parse json data')

    return
  }
}

const parser = (data: any, language: string) => {
  const { coverInfo, videoList } = data

  let airing_status
  if (coverInfo.episodeUpdated === '0') {
    airing_status = 'Upcoming'
  } else if (coverInfo.episodeUpdated === coverInfo.episodeAll) {
    airing_status = 'Ended'
  } else {
    airing_status = 'Airing'
  }

  return {
    title: coverInfo.title,
    synopsis: unescape(coverInfo.description).trim(),
    synopsis_source: 'WeTV',
    airing_platform: 'WeTV',
    cover_url: coverInfo.posterHz,
    poster_url: coverInfo.posterVt,
    number_of_episodes:
      coverInfo.episodeAll !== '0' ? Number(coverInfo.episodeAll) : null,
    rating_name: coverInfo.ratingName,
    release_year: Number(coverInfo.year),
    airing_status,
    watch_link: `https://wetv.vip/${language}/album/${coverInfo.cid}`,
    episodes: videoList
      .filter((d: any) => !d.isTrailer)
      .map((d: any) => ({
        // drama_id,
        // language,
        episode_number: Number(d.episode),
        title: d.title,
        preview_img: d.pic_640_360 || d.pic_496_280 || d.pic_332_187,
        runtime: d.duration,
        air_date: d.videoCheckUpTime.substring(0, 10),
        synopsis: d.desc || d.introduction,
      })),
    tv_genres: coverInfo.mainGenres,
  }
}

export const tv = async (url: string, language: string = 'en') => {
  const data = await scraper(url, language)

  const { episodes, ...rest } = parser(data, language)

  return rest
}

export const episodes = async (
  drama_id: number,
  url: string,
  language: string,
) => {
  const data = await scraper(url, language)

  const tv = parser(data, language)
  tv.episodes.forEach((episode: any) => {
    Object.assign(episode, { drama_id, language })
  })

  return tv
}
