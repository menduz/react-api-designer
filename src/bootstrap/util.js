export const getLocationQueryVariable = (paramName: string, defaultValue: string = '') => {
  const query = window.location.search.substring(1)

  const result = query.split('&')
    .map(v => v.split('='))
    .find(pair => decodeURIComponent(pair[0]) === paramName)

  return result ? decodeURIComponent(result[1]) : defaultValue
}

export const warnBeforeLeave = (repositoryContainer) => {
  window.addEventListener("beforeunload", e => {
    if (repositoryContainer.isLoaded && repositoryContainer.repository.hasDirtyFiles()) {
      if (window.nodeRequire) {
        // electron context doesnt show native warning dialog, need custom handling.
      } else {
        // show native warning dialog before leave
        // eslint-disable-next-line
        const confirmationMessage = "\o/"
        e.returnValue = confirmationMessage     // Gecko, Trident, Chrome 34+
        return confirmationMessage              // Gecko, WebKit, Chrome <34
      }
    }
  })
}