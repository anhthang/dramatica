import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { people_id } = event.context.params
  const { language } = getQuery(event)

  const { data, error } = await client
    .from('people')
    .select(
      `*,
      dramas:drama_cast(*, drama:dramas(*, translations:drama_translations(*))),
      drama_crew(*, drama:dramas(*, translations:drama_translations(*)))
      `,
    )
    .eq('id', people_id)
    .single()

  if (error) {
    throw createError(error.message)
  }

  if (data) {
    data.dramas = data.dramas.concat(data.drama_crew)

    data.dramas.forEach(({ drama }) => {
      const translation = drama.translations.find(
        (t) => t.language === language,
      )
      if (translation) {
        const { id, ...rest } = translation
        Object.assign(drama, rest)
      }

      delete drama.translations
    })

    delete data.drama_crew
  }

  return data
})
