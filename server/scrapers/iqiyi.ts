import dayjs from 'dayjs'
import get from 'lodash.get'
import unescape from 'lodash.unescape'
import xpath from 'xpath-html'

const langCodeMap: { [x: string]: string } = {
  en: 'en_us',
  vi: 'vi_vn',
}

const scraper = async (url: string) => {
  const html = await fetch(url).then((res) => res.text())

  const node = xpath
    .fromPageSource(html)
    .findElement('//script[@id="__NEXT_DATA__"]')

  try {
    const data = JSON.parse(node.getText())

    const {
      videoAlbumInfo: { albumId },
    } = data?.props?.initialState?.album || {}
    return { albumId }
  } catch (error) {
    console.log('unable to parse json data')

    return { albumId: '' }
  }
}

export const tv = async (url: string, language: string = 'en') => {
  const { albumId } = await scraper(url)

  const params: { [x: string]: string } = {
    platformId: '3',
    modeCode: 'cn',
    langCode: langCodeMap[language],
  }

  const { data } = await fetch(
    `https://pcw-api.iq.com/api/epgInfo/${albumId}?${new URLSearchParams(params)}`,
  ).then((res) => res.json())

  const publishTime = dayjs(data.publishTime, 'YYYYMMDD')

  let airing_status
  if (data.preview === 1) {
    airing_status = 'Upcoming'
  } else if (data.tvCount === data.total) {
    airing_status = 'Ended'
  } else {
    airing_status = 'Airing'
  }

  return {
    title: data.name.trim(),
    synopsis: unescape(data.desc).trim(),
    synopsis_source: 'iQIYI',
    airing_platform:
      data.isExclusive === 1 || data.isQiyiProduced === 1 ? 'iQIYI' : null,
    airing_status,
    rating_name: data.rating,
    cover_url: data.albumPic
      .replace('http://', 'https://')
      .replace('.jpg', '_1080_608.jpg'),
    poster_url: data.posterPic
      .replace('http://', 'https://')
      .replace('.jpg', '_260_360.jpg'),
    release_year: publishTime.year(),
    // air_date: data.preview === 0 ? publishTime.format('YYYY-MM-DD') : null,
    number_of_episodes: data.total > 0 ? data.total : null,
    watch_link: `https://www.iq.com/album/${data.albumHrefLangPile[language]}`,
  }
}

export const episodes = async (
  drama_id: number,
  url: string,
  language: string,
) => {
  const { albumId } = await scraper(url)

  const information: { [x: string]: any } = await tv(url, language)

  const params: { [x: string]: string } = {
    platformId: '3',
    modeCode: 'cn',
    langCode: langCodeMap[language],
    startOrder: '1',
    endOrder: information.number_of_episodes,
  }

  const response = await fetch(
    `https://pcw-api.iq.com/api/v2/episodeListSource/${albumId}?${new URLSearchParams(params)}`,
  ).then((res) => res.json())

  const episodeList = get(response, 'data.epg', [])

  /**
   * to get more accurate episode information
   * title: May contain Chinese characters
   * air_date: This field might represent the upload date instead of the air date. Use it for iQiyi original TV shows and dramas only.
   */
  information.episodes = episodeList
    .filter((e: any) => e.contentType === 1)
    .map((episode: any) => {
      return {
        drama_id,
        language,
        title: episode.name,
        episode_number: episode.order,
        preview_img: episode.pic.replace('.jpg', '_480_270.jpg'),
        air_date: episode.initIssueTime.substring(0, 10),
        runtime: episode.len,
      }
    })

  return information
}
