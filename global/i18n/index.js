export const GetAll = () => {
  const _locales = Object.keys(locales)
  return regionConstant.filter(x => _locales.indexOf(`${x.cc_iso}-${x.cc}`) > -1)
}