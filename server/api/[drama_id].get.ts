import { serverSupabaseClient } from '#supabase/server'
import pick from 'lodash.pick'
import sortBy from 'lodash.sortby'
import { getStreamingService } from '~/utils'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const drama_id = getRouterParam(event, 'drama_id')

  const { data, error } = await client
    .from('dramas')
    .select(
      `*,
      availability:drama_availability(*),
      cast:drama_cast(*, people(*)),
      crew:drama_crew(*, people(*)),
      episodes(*),
      genres:drama_genres(genre:genres(name)),
      translations:drama_translations(*)
      `,
    )
    .eq('id', drama_id)
    .single()

  if (error) {
    throw createError(error.message)
  }

  if (data) {
    const en: any = pick(data, [
      'title',
      'drama_id',
      'language',
      'synopsis',
      'synopsis_source',
      'cover_url',
      'poster_url',
      'watch_link',
      'created_at',
    ])

    en.language = 'en'
    en.drama_id = Number(drama_id)

    data.translations.unshift(en)
    data.cast = sortBy(data.cast, ['billing_order', 'people.name'])

    if (data.watch_link) {
      data.availability.unshift({
        streaming_service: getStreamingService(data.watch_link),
        watch_link: data.watch_link,
      })
    }
  }

  return data
})
