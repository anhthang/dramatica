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
    return {
      episodes: [],
    }
  }

  try {
    text = text.substring(72, text.length - 1)
    const i18n = JSON.parse(text)

    const { data } = i18n

    const tv = {
      title: get(data, 'data.data.extra.showName'),
      number_of_episodes: get(data, 'data.data.extra.episodeTotal'),
      runtime: get(data, 'data.data.extra.duration'),
      cover_url: get(data, 'data.data.extra.showImg'),
      poster_url: get(data, 'data.data.extra.showImgV'),
      episodes: [],
    }

    const publishTime = get(data, 'data.data.extra.videoPublishTime')
    if (publishTime) {
      tv.air_date = publishTime.substring(0, 10)
      tv.release_year = Number(publishTime.substring(0, 4))
    }

    const nodes = get(data, 'data.nodes[0].nodes', [])
    nodes.forEach(
      ({
        typeName,
        nodes = [],
        data,
      }: {
        typeName: string
        nodes: any[]
        data: any
      }) => {
        switch (typeName) {
          case '播放页简介组件': // tv information
            if (data && data.title === '简介') {
              tv.synopsis = unescape(get(nodes[0], 'data.desc'))
              tv.synopsis_source = 'Youku'
              tv.airing_platform = 'Youku'
            }
            break
          case 'Web播放页选集组件': // tv episodes
            tv.episodes = nodes
              .filter((n) => get(n, 'data.videoType') === '正片')
              .map((node) => {
                return {
                  // drama_id,
                  // language,
                  title: get(node, 'data.title'),
                  episode_number: get(node, 'data.stage'),
                  preview_img: get(node, 'data.img'),
                }
              })
            break
          default:
            break
        }
      },
    )

    return tv
  } catch (error) {
    console.log('unable to parse i18n')

    return {
      episodes: [],
    }
  }
}

export const tv = async (url: string) => {
  const { episodes, ...rest } = await scraper(url)

  return rest
}

export const episodes = async (
  drama_id: number,
  url: string,
  language: string,
) => {
  const tv = await scraper(url)
  tv.episodes.forEach((episode: any) => {
    Object.assign(episode, { drama_id, language })
  })
}
