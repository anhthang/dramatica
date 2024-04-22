import get from 'lodash.get'
import unescape from 'lodash.unescape'
import urlMetadata from 'url-metadata'
import xpath from 'xpath-html'

export const tv = async (url: string) => {
  const metadata = await urlMetadata(url)

  const {
    datePublished,
    irAlbumName: title,
    jsonld,
    url: watch_link,
  } = metadata

  const information: { [x: string]: any } = {
    title,
    synopsis_source: 'Youku',
    airing_platform: 'Youku',
    watch_link,
  }

  if (datePublished) {
    information.air_date = datePublished.substring(0, 10)
    information.release_year = Number(datePublished.substring(0, 4))
  }

  if (Array.isArray(jsonld)) {
    jsonld.forEach((data: any) => {
      switch (data['@type']) {
        case 'TVSeries':
          information.synopsis = unescape(data.description)
          break
        default:
          break
      }
    })
  }

  return information
}

export const episodes = async (
  drama_id: number,
  url: string,
  language: string,
) => {
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
              tv.synopsis = get(nodes[0], 'data.desc')
            }
            break
          case 'Web播放页选集组件': // tv episodes
            tv.episodes = nodes
              .filter((n) => get(n, 'data.videoType') === '正片')
              .map((node) => {
                return {
                  drama_id,
                  language,
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
