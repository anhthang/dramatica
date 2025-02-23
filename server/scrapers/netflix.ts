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
      cookie: process.env.NETFLIX_COOKIE || '',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw createError(`${response.status} - ${response.statusText}`)
  }

  const { data, errors } = await response.json()
  if (Array.isArray(errors)) {
    throw createError(errors[0].message)
  }

  return data
}

const tvDetail = async (unifiedEntityId: string, lang: string) => {
  const body = {
    operationName: 'DetailModal',
    variables: {
      opaqueImageFormat: 'JPG',
      transparentImageFormat: 'PNG',
      videoMerchEnabled: true,
      fetchPromoVideoOverride: false,
      hasPromoVideoOverride: false,
      promoVideoId: 0,
      videoMerchContext: 'BROWSE',
      isLiveEpisodic: false,
      artworkContext: {
        groupLoc: 'eyJrLnR5cGUiOiJuZXRmbGl4b3JpZ2luYWxzIn0.',
      },
      textEvidenceUiContext: 'ODP',
      unifiedEntityId,
    },
    extensions: {
      persistedQuery: {
        id: process.env.NETFLIX_DETAIL_MODAL_HASH,
        version: 102,
      },
    },
  }

  return await requester(body, lang)
}

export const tv = async (url: string, language: string) => {
  const urlObj = new URL(url)

  const [, , titleId] = urlObj.pathname.split('/')

  const unifiedEntityId = `Video:${titleId}`

  const data = await tvDetail(unifiedEntityId, language)

  const tv: { [x: string]: any } = {
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
        rating_name: get(video, 'contentAdvisory.certificationValue'),
        cover_url: get(video, 'boxartHighRes.url'), // might be included "Recently Added" text
        season_id: get(video, 'currentEpisode.parentSeason.videoId'),
      }

      Object.assign(tv, detail)
    }
  }

  if (language === 'vi') {
    tv.title = capitalizeFirstLetters(tv.title)
  }

  return tv
}

export const episodes = async (
  drama_id: number,
  url: string,
  language: string,
) => {
  const info = await tv(url, language)

  const season = await requester(
    {
      operationName: 'PreviewModalEpisodeSelectorSeasonEpisodes',
      variables: {
        seasonId: info.season_id,
        count: info.number_of_episodes,
        opaqueImageFormat: 'JPG',
        artworkContext: {},
      },
      extensions: {
        persistedQuery: {
          id: process.env.NETFLIX_PREVIEW_MODAL_HASH,
          version: 102,
        },
      },
    },
    language,
  )

  const edges = get(season, 'videos[0].episodes.edges', [])

  info.episodes = edges.map((e: any) => {
    return {
      language,
      episode_number: e.node.number,
      title: e.node.title,
      preview_img: e.node.artwork.url,
      synopsis: e.node.contextualSynopsis.text.trim(),
      synopsis_source: 'Netflix',
      runtime: e.node.runtimeSec || e.node.displayRuntimeSec,
      drama_id,
    }
  })

  return info
}
