import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as Raml from '../../languages/Raml'
import './Editor.css';

class DesignerEditor extends React.Component {
  constructor(props) {
    super(props)
    this.onSuggest = this.onSuggest.bind(this)

    this.language = props.language.toLowerCase()
    this.editor = null
    this.monaco = null
    this.timer = null;

    this.state = {
      code : props.code
    }
  }

  isRamlLanguage() {
    return this.language === 'raml'
  }

  editorWillMount(monaco) {
    this.monaco = monaco

    if (this.isRamlLanguage()) { // Register RAML language
      const languages = monaco.languages;
      languages.register(Raml.language(this.language))
      languages.setLanguageConfiguration(this.language, Raml.configurations())
      languages.setMonarchTokensProvider(this.language, Raml.tokens())
      languages.registerCompletionItemProvider(this.language, {
        provideCompletionItems: (model, position) => {
          return new Promise((resolve) => {
            this.onSuggest(position, resolve)
          })
        }
      })
    }
  }

  editorDidMount(editor, monaco) {
    this.editor = editor
    this.monaco = monaco
    editor.getModel().updateOptions({tabSize: 2})
  }

  onChange(newValue, event) {
    function handleOnChange() {
      this.props.onChange(newValue, event)
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }

    if (this.props.onChange !== undefined) {
      this.timer = setTimeout(handleOnChange.bind(this), 200)
      this.setState({ code :  newValue })
    }
  }

  onSuggest(position, resolve) {
    if (this.props.onSuggest !== undefined) {
      if (this.onSuggestCallback) {
        // resolve any pending promise before replacing
        this.onSuggestCallback([])
      }
      this.onSuggestCallback = resolve
      this.props.onSuggest(position)
    }
  }

  renderSuggestions(suggestions) {
    if (this.onSuggestCallback) {
      console.log(suggestions)
      this.onSuggestCallback(suggestions.map(suggestion => {
        return {
          kind: this.monaco.languages.CompletionItemKind.Text, // chose Kind based on category?
          insertText: suggestion.text || suggestion.displayText || '',
          label: suggestion.displayText,
          documentation: suggestion.description
        }
      }))
      this.onSuggestCallback = null
    }
  }

  renderErrors(errors) {
    let parsedErrors = []
    if (errors && errors.length > 0) {
      parsedErrors = errors.map(error => {
        const from = error.range.start
        const to = error.range.end

        const line = Math.max(1, from.line)
        const startColumn = from.column
        const endColumn = to && to.column ? to.column : this.editor.getModel().getLineContent(line).length + 1

        return {
          message: error.message,
          startLineNumber: line,
          endLineNumber: line,
          startColumn,
          endColumn,
          severity: error.isWarning ? this.monaco.Severity.Warning : this.monaco.Severity.Error
        }
      }, this);
    }
    this.monaco.editor.setModelMarkers(this.editor.getModel(), '', parsedErrors)
  }

  render() {
    if (this.monaco && this.isRamlLanguage()) {
      this.renderErrors(this.props.errors)
      this.renderSuggestions(this.props.suggestions)
    }

    const theme = this.props.theme ? this.props.theme : 'vs'

    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      theme: theme,
      cursorStyle: 'line',
      automaticLayout: false,
    }

    // todo review loading of Monaco assets
    const requireConfig = {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      paths: {
        'vs': `${process.env.PUBLIC_URL}/static/js/vs`
      }
    }

    return (
      <div className="Editor">
        <MonacoEditor
          requireConfig={requireConfig}
          height="800"
          width="auto"
          value={this.state.code}
          options={options}
          language={this.props.language}
          onChange={this.onChange.bind(this)}
          editorWillMount={this.editorWillMount.bind(this)}
          editorDidMount={this.editorDidMount.bind(this)}
        />
      </div>
    )
  }
}

DesignerEditor.propTypes = {
  language: React.PropTypes.string.isRequired,
  code: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  onSuggest: React.PropTypes.func,
  errors: React.PropTypes.arrayOf(React.PropTypes.object),
  suggestions: React.PropTypes.arrayOf(React.PropTypes.object),
  theme: React.PropTypes.string
}

export default DesignerEditor