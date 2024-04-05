import { serverSupabaseClient } from '#supabase/server'
import pick from 'lodash.pick'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const tv = pick(body, [
    'title',
    'title_pinyin',
    'release_year',
    'number_of_episodes',
    'synopsis',
    'airing_platform',
    'poster_url',
    'air_day',
    'title_vi',
    'trailer_url',
    'synopsis_source',
    'cover_url',
    'watch_link',
    'air_date',
    'end_date',
    'airing_status',
  ])

  const { data, error } = await client
    .from('dramas')
    .update(tv)
    .eq('id', body.id)

  if (error) {
    throw createError(error.message)
  }

  return data
})
