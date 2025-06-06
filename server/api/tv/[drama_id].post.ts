import { serverSupabaseClient } from '#supabase/server'
import pick from 'lodash.pick'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const tv = pick(body, [
    'title',
    'title_pinyin',
    'original_title',
    'release_year',
    'number_of_episodes',
    'synopsis',
    'airing_platform',
    'poster_url',
    'air_day',
    'rating_name',
    'synopsis_source',
    'cover_url',
    'watch_link',
    'douban',
    'imdb',
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

  if (Array.isArray(body.tv_genres) && body.tv_genres.length) {
    await client
      .from('drama_genres')
      .delete()
      .eq('drama_id', body.id)
      .neq('genre_id', body.tv_genres)

    const toInsert = body.tv_genres.map((genre_id: number) => ({
      drama_id: body.id,
      genre_id,
    }))

    await client
      .from('drama_genres')
      .upsert(toInsert, { ignoreDuplicates: true })
  }

  return data
})
