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


export const copyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
