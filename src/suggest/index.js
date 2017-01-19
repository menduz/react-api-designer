import ContentProvider from './ContentProvider'
import FSContent from './FSContent'
import RAML from 'raml-suggestions'

export default class RamlSuggestions {

  static suggestions(content, cursorPosition) {
    const fscontent  = new FSContent(content, RamlSuggestions.calcOffset(content, cursorPosition));

    return RAML.suggestAsync(fscontent, new ContentProvider())
      .then(result => Array.isArray(result) ? result : [])
      .catch(() => [])
  }

  static range(start, stop) {
    const result = new Array(stop - start + 1);
    for (let i = start; i <= stop; i++) {
      result[i - start] = i;
    }
    return result;
  }

  static calcOffset (content, cursorPosition) {
    const lines = Array.from(content.split('\n'))
    const allPreviewsLinesSize = RamlSuggestions.range(0, cursorPosition.lineNumber - 2)
      .map(index => lines[index].length + 1)
      .reduce((total, size) => total + size, 0)

    return allPreviewsLinesSize + cursorPosition.column;
  }
}

