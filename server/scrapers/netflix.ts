import get from 'lodash.get'

const capitalizeFirstLetters = (str: string) => {
  const words = str.toLowerCase().split(' ')
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
  }
  return words.join(' ')
}

const requester = async (body: any, lang: string) => {
  const response = await fetch('https://web.prod.cloud.netflix.com/graphql', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'x-netflix.context.locales': `${lang}-vn`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw createError(`${response.status} - ${response.statusText}`)
  }

  const { data } = await response.json()

  return data
}

const tvDetail = async (unifiedEntityId: string, lang: string) => {
  const body = {
    operationName: 'DetailModal',
    variables: {
      opaqueImageFormat: 'JPG',
      transparentImageFormat: 'PNG',
      videoMerchEnabled: true,
      hasPromoVideoOverride: false,
      promoVideoId: 0,
      videoMerchContext: 'BROWSE',
      artworkContext: {},
      textEvidenceUiContext: 'ODP',
      unifiedEntityId,
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: process.env.NETFLIX_DETAIL_MODAL_HASH,
      },
    },
  }

  return await requester(body, lang)
}

const tvScraper = async (titleId: string, lang: string) => {
  const url = `https://www.netflix.com/title/${titleId}`
  const unifiedEntityId = `Video:${titleId}`

  const data = await tvDetail(unifiedEntityId, lang)

  const information: { [x: string]: any } = {
    synopsis_source: 'Netflix',
    watch_link: url,
  }

  if (Array.isArray(data.unifiedEntities)) {
    const video = data.unifiedEntities.find(
      (e: any) => e.unifiedEntityId === unifiedEntityId,
    )

    if (video) {
      const detail = {
        title: get(video, 'title'),
        synopsis: get(video, 'contextualSynopsis.text'),
        number_of_episodes: get(
          video,
          'currentEpisode.parentSeason.episodes.totalCount',
          null,
        ),
        // rating: get(video, 'contentAdvisory.certificationValue'),
        cover_url: get(video, 'boxartHighRes.url'), // might be included "Recently Added" text
      }

      Object.assign(information, detail)
    }
  }

  return information
}

export const tv = async (url: string, language: string) => {
  const urlObj = new URL(url)

  const [, , titleId] = urlObj.pathname.split('/')

  const en = await tvScraper(titleId, 'en')
  const vi = await tvScraper(titleId, 'vi')

  if (vi && vi.title) {
    vi.title = capitalizeFirstLetters(vi.title)
    en.title_vi = vi.title
  }

  if (language === 'vi') {
    return vi
  }

  return en
}

export const episodes = async (
  drama_id: string,
  url: string,
  language: string,
) => {
  const urlObj = new URL(url)

  const [, , titleId] = urlObj.pathname.split('/')

  const unifiedEntityId = `Video:${titleId}`

  const data = await tvDetail(unifiedEntityId, language)
  if (!Array.isArray(data.unifiedEntities)) {
    return []
  }

  const video = data.unifiedEntities.find(
    (e: any) => e.unifiedEntityId === unifiedEntityId,
  )

  if (!video) {
    return []
  }

  const seasonId = get(video, 'currentEpisode.parentSeason.videoId')
  const count = get(
    video,
    'currentEpisode.parentSeason.episodes.totalCount',
    100,
  )

  const season = await requester(
    {
      operationName: 'PreviewModalEpisodeSelectorSeasonEpisodes',
      variables: {
        seasonId,
        count,
        opaqueImageFormat: 'JPG',
        artworkContext: {},
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: process.env.NETFLIX_PREVIEW_MODAL_HASH,
        },
      },
    },
    language,
  )

  const edges = get(season, 'videos[0].episodes.edges', [])

  return edges.map((e: any) => {
    return {
      language,
      episode_number: e.node.number,
      title: e.node.title,
      preview_img: e.node.artwork.url,
      synopsis: e.node.contextualSynopsis.text.trim(),
      synopsis_source: 'Netflix',
      runtime: e.node.runtimeSec || e.node.displayRuntimeSec,
      drama_id: Number(drama_id),
    }
  })
}
