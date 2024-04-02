export const toLocaleDate = (str: string, locale: string = 'en') => {
  return new Date(str).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
