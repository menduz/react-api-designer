import ContentProvider from './ContentProvider'
import FSContent from './FSContent'
import ramlSuggestions from 'raml-suggestions'

export default class RamlSuggestions {

  constructor(onFileRequest) {
    this.onFileRequest = onFileRequest
  }

  suggestions(content, cursorPosition) {
    const fsContent  = new FSContent(content, RamlSuggestions.calcOffset(content, cursorPosition));
    const contentProvider = new ContentProvider(this.onFileRequest);
    return ramlSuggestions.suggestAsync(fsContent, contentProvider).then(RamlSuggestions._mapResults)
  }

  static _mapResults(results) {
    if (!Array.isArray(results)) return []

    return results.map(suggestion => {
      return {
        kind: suggestion.category,
        label: suggestion.displayText || suggestion.text || '',
        insertText: suggestion.text || suggestion.displayText || '',
        documentation: suggestion.description || ''
      }
    })
  }

  static calcOffset(content, cursorPosition) {
    const lines = Array.from(content.split('\n'))
    const allPreviewsLinesSize = RamlSuggestions.range(0, cursorPosition.lineNumber - 2)
      .map(index => lines[index].length + 1)
      .reduce((total, size) => total + size, 0)
    return allPreviewsLinesSize + cursorPosition.column -1;
  }

  static range(start, stop) {
    const result = new Array(stop - start + 1);
    for (let i = start; i <= stop; i++) {
      result[i - start] = i;
    }
    return result;
  }
}

