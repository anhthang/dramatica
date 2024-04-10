import { serverSupabaseClient } from '#supabase/server'
import isEqual from 'lodash.isequal'
import keyBy from 'lodash.keyby'
import pick from 'lodash.pick'

const columns = [
  'title',
  'episode_number',
  // 'air_date',
  'preview_img',
  'runtime',
  'synopsis_source',
  'synopsis',
]

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const drama_id: string = getRouterParam(event, 'drama_id') || ''
  const { language } = body[0]

  const { data: episodes } = await client
    .from('episodes')
    .select()
    .eq('drama_id', drama_id)
    .eq('language', language)

  if (episodes?.length) {
    const episodeMap = keyBy(episodes, 'episode_number')

    const toInsert: any[] = []
    const toUpdate: { [id: number]: any } = {}

    body.forEach((ep: any) => {
      if (episodeMap[ep.episode_number]) {
        // to update
        const before = pick(episodeMap[ep.episode_number], columns)
        const after = pick(ep, columns)

        const equal = isEqual(before, after)
        if (!equal) {
          // to update db
          const { id } = episodeMap[ep.episode_number]
          toUpdate[id] = after
        }
      } else {
        // to insert
        toInsert.push(ep)
      }
    })

    if (toInsert.length) {
      const { error } = await client.from('episodes').insert(toInsert)
      if (error) {
        throw createError(error.message)
      }
    }

    if (Object.keys(toUpdate).length) {
      const promises = Object.entries(toUpdate).map(([id, row]) => {
        return client.from('episodes').update(row).eq('id', id)
      })

      await Promise.all(promises)
    }
  } else {
    const { error } = await client.from('episodes').insert(body)
    if (error) {
      throw createError(error.message)
    }
  }

  return true
})
