import get from 'lodash.get'
import keyBy from 'lodash.keyby'
import unescape from 'lodash.unescape'
import xpath from 'xpath-html'
import { isoDuration2Seconds } from '~/utils'

const addProtocol = (path: string) => {
  if (path.startsWith('http')) {
    return path
  } else if (path.startsWith('//')) {
    return `https:${path}`
  } else {
    return `https://${path}`
  }
}

const scraper = async (url: string) => {
  const html = await fetch(url).then((res) => res.text())

  const node = xpath
    .fromPageSource(html)
    .findElement('//script[@id="__NEXT_DATA__"]')

  try {
    const data = JSON.parse(node.getText())

    return data
  } catch (error) {
    console.log('unable to parse json data')

    return
  }
}

const parser = (data: any, language: string = 'en') => {
  const cacheAlbumList = data?.props?.initialState?.album?.cacheAlbumList || {}
  const videoAlbumInfo = data?.props?.initialState?.album?.videoAlbumInfo || {}

  const episodes = cacheAlbumList[1]
    .filter((a: any) => a.payMark !== 'preview')
    .map((a: any) => ({
      episode_number: a.order,
      play_url: addProtocol(a.albumPlayUrl),
    }))

  const href = keyBy(videoAlbumInfo.albumHrefLangPile, 'hreflang')
  const suffix = href[language]
    ? href[language].href
    : videoAlbumInfo.albumLocSuffix

  const tv = {
    title: videoAlbumInfo.name.trim(),
    synopsis: unescape(videoAlbumInfo.desc),
    synopsis_source: 'iQIYI',
    // rating: videoAlbumInfo.rating,
    cover_url: videoAlbumInfo.albumFocus1024.replace('http://', 'https://'),
    poster_url: addProtocol(videoAlbumInfo.thumbnailUrl2),
    release_year: Number(videoAlbumInfo.year),
    number_of_episodes: videoAlbumInfo.total,
    watch_link: `https://www.iq.com/album/${suffix}`,
    episodes,
  }

  return tv
}

export const tv = async (url: string) => {
  const data = await scraper(url)

  const { episodes, ...rest } = parser(data)

  return rest
}

export const episodes = async (
  drama_id: number,
  url: string,
  language: string,
) => {
  const data = await scraper(url)

  const tv = parser(data, language)

  const scrapers = tv.episodes.map((ep: any) => scraper(ep.play_url))

  /**
   * to get more accurate episode information
   * title: May contain Chinese characters
   * air_date: This field might represent the upload date instead of the air date. Use it for iQiyi original TV shows and dramas only.
   */
  const episodes = await Promise.all(scrapers)

  tv.episodes = episodes.map((data) => {
    const current = get(data, 'props.initialState.play.curVideoInfo', {})

    return {
      drama_id,
      language,
      title: current.name,
      episode_number: current.order,
      preview_img: addProtocol(current.albumPic284),
      air_date: current.isoUploadDate.substring(0, 10),
      runtime: isoDuration2Seconds(current.isoDuration),
    }
  })

  return tv
}
