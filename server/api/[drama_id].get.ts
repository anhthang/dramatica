import { serverSupabaseClient } from '#supabase/server'
import pick from 'lodash.pick'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const drama_id = getRouterParam(event, 'drama_id')

  const { data, error } = await client
    .from('dramas')
    .select(
      `*,
      availability:drama_availability(*),
      cast:drama_cast(*, person:people(*)),
      crew:drama_crew(*, person:people(*)),
      episodes(*),
      genres:drama_genres(genre:genres(id, name)),
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
    data.translations.forEach((d: any) => {
      d.title_year = data.release_year
        ? `${d.title} (${data.release_year})`
        : d.title
    })

    data.title_year = data.release_year
      ? `${data.title} (${data.release_year})`
      : data.title

    data.cast = sortBy(data.cast, ['billing_order', 'people.name'])

    data.genres = data.genres.map(({ genre }) => genre)
  }

  return data
})
