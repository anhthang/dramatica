import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query, language } = getQuery(event)

  let sqlQuery
  if (query) {
    const fts = query
      .toString()
      .trim()
      .split(/[\s,\t,\n]+/) // split and remove more than 1 space
      .join(' | ')

    sqlQuery = client
      .from('dramas')
      .select('*, translations:drama_translations(*)')
      .textSearch('title', `${fts}`)
      .order('release_year', { ascending: false })
      .order('air_date', { ascending: false })
      .order('title')
      .limit(10)
  } else {
    sqlQuery = client
      .from('dramas')
      .select('*, translations:drama_translations(*)')
      .order('release_year', { ascending: false })
      .order('air_date', { ascending: false })
      .order('title')
  }

  const { data, error } = await sqlQuery

  if (error) {
    throw createError(error.message)
  }

  data.forEach((drama) => {
    const translation = drama.translations.find((t) => t.language === language)
    if (translation) {
      const { id, ...rest } = translation
      Object.assign(drama, rest)
    }

    delete drama.translations
  })

  return data
})
