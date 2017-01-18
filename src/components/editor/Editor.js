import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as Raml from '../../languages/Raml'
import './Editor.css';

class DesignerEditor extends React.Component {
  constructor(props) {
    super(props)
    this.onSuggest = this.onSuggest.bind(this)

    this.editor = null
    this.language = props.language.toLowerCase()
    this.monaco = null
    this.timer = null;

    this.state = {
      code : props.code
    }
  }

  isNewLanguage() {
    return this.language === 'raml'
  }

  editorWillMount(monaco) {
    if (this.isNewLanguage()) { // Register RAML language
      monaco.languages.register(Raml.language())
      monaco.languages.setLanguageConfiguration(this.language, Raml.configurations())
      monaco.languages.setMonarchTokensProvider(this.language, Raml.tokens())
    }
    this.monaco = monaco
  }

  editorDidMount(editor, monaco) {
    this.editor = editor
    this.monaco = monaco

    if (this.isNewLanguage()) {
      this.registerCompletion()
    }
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
      this.onSuggestCallback = resolve
      this.props.onSuggest(position)
    }
  }

  registerCompletion() {
    this.monaco.languages.registerCompletionItemProvider(this.language, {
      provideCompletionItems: (model, position) => {
        return new Promise((resolve) => {
          this.onSuggest(position, resolve)
        })
      }
    })
  }

  renderSuggestions(suggestions) {
    if (this.onSuggestCallback) {
      this.onSuggestCallback(suggestions)
      this.onSuggestCallback = null
    }
  }

  renderErrors(errors) {
    const hasErrors = errors !== undefined && errors.length > 0

    if (hasErrors) {
      var parsedErrors = errors.map(function (error) {
        const start = error.range.start
        const line = start.line
        const lineSize = this.editor.getModel().getLineContent(line).length + 1
        const severity = error.isWarning ? this.monaco.Severity.Warning : this.monaco.Severity.Error

        return {
          severity: severity,
          startLineNumber: line,
          startColumn: start.column,
          endLineNumber: line,
          endColumn: lineSize,
          message: error.message
        }
      }, this)

      this.monaco.editor.setModelMarkers(this.editor.getModel(), '', parsedErrors)
    } else if (this.monaco !== null) {
      this.monaco.editor.setModelMarkers(this.editor.getModel(), '', [])
    }
  }

  render() {
    if (this.isNewLanguage()) {
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