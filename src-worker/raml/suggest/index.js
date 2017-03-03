// @flow

import FSResolverExtImpl from './FSResolverExtImpl'
import FSContent from './FSContent'
import ramlSuggestions from 'raml-suggestions'
import {RequestFileFunction, CursorPosition} from '../types'

import type {RepositoryElementType} from '../../../src/repository/type'

export default class RamlSuggestions {
  onFileRequest: RequestFileFunction

  constructor(onFileRequest: RequestFileFunction) {
    this.onFileRequest = onFileRequest
  }

  suggestions(content: string, cursorPosition: CursorPosition, path: string, repository: RepositoryElementType) {
    const offset = RamlSuggestions.calcOffset(content, cursorPosition)

    const fsContent  = new FSContent(content, offset, path);
    const fsResolverExt = new FSResolverExtImpl(this.onFileRequest, repository)
    const contentProvider = ramlSuggestions.getContentProvider(fsResolverExt)

    return ramlSuggestions.suggestAsync(fsContent, contentProvider)
      .then(RamlSuggestions._mapResults)
  }

  static _mapResults(results) {
    if (!Array.isArray(results)) {
      console.error('Recieved invalid object from suggestions: ', results)
      return []
    }

    return results.map(suggestion => {

      //this removes indentation in the last line, because it is added by monaco editor
      const split = suggestion.text.split('\n');
      let text = ''
      if (split.length > 1) {
        let sep = ''
        for (let i = 0; i < split.length - 1; i++) {
          text = text + sep + split[i]
          sep = '\n'
        }
        text = text + '\n\t'
      } else {
        text = suggestion.text
      }

      return {
        replacementPrefix:  suggestion.replacementPrefix || '',
        label: suggestion.displayText || suggestion.text || '',
        insertText: text,
        documentation: suggestion.description,
        detail: suggestion.category !== 'unknown' ? suggestion.category : undefined
        // todo give range property for better competition
      }
    })
  }

  static calcOffset(content: string, cursorPosition: CursorPosition): number {
    const lines = Array.from(content.split('\n'))
    const allPreviewsLinesSize = RamlSuggestions.range(0, cursorPosition.lineNumber - 2)
      .map(index => lines[index].length + 1)
      .reduce((total, size) => total + size, 0)
    return allPreviewsLinesSize + cursorPosition.column -1;
  }

  static range(start: number, stop: number): number[] {
    const result = new Array(stop - start + 1);
    for (let i = start; i <= stop; i++) {
      result[i - start] = i;
    }
    return result;
  }
}

