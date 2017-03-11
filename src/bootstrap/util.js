export const getLocationQueryVariable = (paramName: string, defaultValue: string = '') => {
  const query = window.location.search.substring(1)

  const result = query.split('&')
    .map(v => v.split('='))
    .find(pair => decodeURIComponent(pair[0]) === paramName)

  console.log(result)

  return result ? decodeURIComponent(result[1]) : defaultValue
}