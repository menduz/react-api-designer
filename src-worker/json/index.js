const errorSearchString = ' in JSON at position ';

const point = (text, errorChar) => {
  let line = 1
  let column = 1

  for (let i = 0; i < errorChar && text.length; i++) {
    if (text.charAt(i) === '\n') {
      line++
      column = 1
    } else column++
  }

  return {line, column}
}

const extractMessageAndPosition = e => {
  const index = e.message.indexOf(errorSearchString);
  let message = e.message
  let errorChar = 0
  if (index > 0) {
    message = e.message.substring(0, index)
    errorChar = parseInt(e.message.substring(index + errorSearchString.length), 10) + 1
  }
  return {message, errorChar}
}

export default (text) => {
  try {
    return Promise.resolve(JSON.parse(text))
  } catch (e) {
    const {message, errorChar} = extractMessageAndPosition(e);
    const position = point(text, errorChar)

    return Promise.reject({
      message: message,
      startLineNumber: position.line,
      endLineNumber: position.line,
      startColumn: position.column
    })
  }
}