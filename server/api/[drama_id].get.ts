import { serverSupabaseClient } from '#supabase/server'
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
      cast:drama_cast(*, people(name, name_vi, profile_url)),
      crew:drama_crew(*, people(name, name_vi, profile_url)),
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
    data.cast = sortBy(data.cast, ['billing_order', 'people.name'])

    data.episodes = data.episodes.filter((e) => e.language === 'en')

    if (data.watch_link) {
      data.availability.unshift({
        streaming_service: getStreamingService(data.watch_link),
        watch_link: data.watch_link,
      })
    }
  }

  return data
})
