import ContentProvider from './ContentProvider'
import FSContent from './FSContent'
import RAML from 'raml-suggestions'

export default class RamlSuggestions {

  static range(start, stop) {
    var result = new Array(stop - start + 1);
    for (var i = start; i <= stop; i++) {
      result[i - start] = i;
    }

    return result;
  }

  static sum(total, size){ return total + size; }

  static calcOffset (content, cursorPosition) {
    console.log('content ' + content)
    const lines = Array.from(content.split('\n'))
    console.log('lines ' + lines[0])
    var allPreviewsLinesSize = RamlSuggestions.range(0, cursorPosition.lineNumber - 2)
      .map(index => { return lines[index].length + 1; })
      .reduce(RamlSuggestions.sum, 0);

    return allPreviewsLinesSize + cursorPosition.column;
  };


  static suggestions(content, cursorPosition) {
    console.log("cursorPosition: " + cursorPosition)
    console.log("suggestions: " + RamlSuggestions.calcOffset(content, cursorPosition))
    const fscontent  = new FSContent(content, RamlSuggestions.calcOffset(content, cursorPosition));

    return RAML.suggestAsync(fscontent,  new ContentProvider()).then(
        function (result) { return Array.isArray(result)? result: []; },
        function () { return []; }
      )
      // .then(function (suggestions) { return suggestions.map(RamlSuggestions.beautifyCategoryName); })
      .then(function (suggestions) { return suggestions.map(RamlSuggestions.ensureTextFieldNotUndefined); })

    //.then(function (suggestions) { return RamlSuggestions.addTextSnippets(editor, suggestions); });

  }

  // static beautifyCategoryName(suggestion) {
  //   // console.log('beautifyCategoryName ' + JSON.stringify(suggestion))
  //   if(suggestion.category === undefined || suggestion.category.toLowerCase() === 'unknown') {
  //     suggestion.category = 'others';
  //   }
  //   return suggestion;
  // }

  static ensureTextFieldNotUndefined(suggestion) {
    // console.log('ensureTextFieldNotUndefined ' + suggestion)
    suggestion.text = suggestion.text || suggestion.displayText || '';
    return {
      insertText : suggestion.text || suggestion.displayText || '',
      label: suggestion.displayText
    }
  }


  // static addTextSnippets(editor, suggestions) {
  //   var ch = editor.getCursor().ch;
  //   var addNewResource = suggestions.length > 0 && (ch === 0 || suggestions.find(function (s) {
  //       return s.category === 'methods' ? s : null;
  //     }));
  //
  //   if (addNewResource && ramlEditorMainHelpers.isApiDefinition(editor.getValue())) {
  //     var prefix = addNewResource.replacementPrefix || '';
  //     var spaces = '\n' + new Array(ch - prefix.length + 1).join(' ') + '  ';
  //     return suggestions.concat({
  //       text: '/newResource:' + spaces + 'displayName: resourceName' + spaces,
  //       displayText: 'New Resource',
  //       category: 'resources',
  //       replacementPrefix: prefix
  //     });
  //   }
  //
  //   return suggestions;
  // }
}

