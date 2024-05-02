import get from 'lodash.get'
import unescape from 'lodash.unescape'
import xpath from 'xpath-html'

const scraper = async (url: string) => {
  const html = await fetch(url).then((res) => res.text())

  const nodes = xpath.fromPageSource(html).findElements('//script')

  let text = nodes
    .map((n: any) => n.getText())
    .find((t: any) => {
      return (
        t &&
        t.includes(
          'window.__USE_SSR__=true;window.__USESSR__=true;window.__INITIAL_DATA__ =',
        )
      )
    })

  if (!text) {
    return
  }

  try {
    text = text.substring(72, text.length - 1)
    const i18n = JSON.parse(text)

    const { data } = i18n

    return data.data
  } catch (error) {
    console.log('unable to parse i18n')

    return
  }
}

const parser = (data: any) => {
  // extra information is for current episode, not tvshow/drama information
  const tv: { [x: string]: any } = {
    title: get(data, 'data.extra.showName'),
    number_of_episodes: get(data, 'data.extra.episodeTotal'),
    cover_url: get(data, 'data.extra.showImg').replace('http://', 'https://'),
    poster_url: get(data, 'data.extra.showImgV').replace('http://', 'https://'),
    watch_link: `https://www.youku.tv/v_nextstage/id_${get(data, 'data.extra.showId')}.html`,
    airing_status: get(data, 'data.extra.completed') ? 'Ended' : 'Airing',
    episodes: [],
  }

  const nodes = get(data, 'nodes[0].nodes', [])
  nodes.forEach((node: any) => {
    switch (node.typeName) {
      case '播放页简介组件': // tv information
        if (node?.data?.title === '简介') {
          tv.synopsis = unescape(get(node.nodes[0], 'data.desc'))
          tv.synopsis_source = 'Youku'
          tv.airing_platform = 'Youku'
        }
        break
      case 'Web播放页选集组件': // tv episodes
        tv.episodes = node.nodes
          .filter((n: any) => n?.data?.videoType === '正片')
          .map((node: any) => {
            return {
              episode_number: get(node, 'data.stage'),
              video_id: get(node, 'data.action.value'),
              // preview_img: get(node, 'data.img'), // high-res
            }
          })
        break
      default:
        break
    }
  })

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

  const tv = parser(data)

  const scrapers = tv.episodes.map((ep: any) => {
    const url = `https://www.youku.tv/v/v_show/id_${ep.video_id}.html`

    return scraper(url)
  })

  const episodes = await Promise.all(scrapers)

  tv.episodes = episodes.map((data) => {
    /**
     * this is publish time for international, it's might not same as domestic air date
     * better uses for exclusive tvshow/drama
     */
    const publishTime = get(data, 'data.extra.videoPublishTime')

    return {
      drama_id,
      language,
      episode_number: get(data, 'data.extra.showVideoStage'),
      title: get(data, 'data.extra.videoTitle'),
      preview_img: get(data, 'data.extra.videoImg'),
      runtime: parseInt(get(data, 'data.extra.duration')),
      air_date: publishTime.substring(0, 10),
    }
  })

  return tv
}
