import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import registerRamlLanguage from './languages/Raml'
import {goToErrorAction} from '../errors/reducer'
import './Editor.css';

// todo review loading of Monaco assets
const requireConfig = {
  url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
  paths: {
    'vs': `${process.env.PUBLIC_URL}/static/js/vs`
  }
}

class DesignerEditor extends React.Component {
  constructor(props) {
    super(props)

    this.editor = null
    this.monaco = null
    this.timer = null;

    this.state = {
      code: props.code
    }
  }

  editorWillMount(monaco) {
    registerRamlLanguage(monaco, (model, position) => {
      return new Promise((resolve) => {
        this.onSuggest(position, resolve)
      })
    })
  }

  editorDidMount(editor, monaco) {
    this.editor = editor
    this.monaco = monaco
    editor.getModel().updateOptions({tabSize: 2})
    this.props.finishLoading(editor, monaco)
  }

  onChange(newValue, event) {
    if (this.timer) {
      clearTimeout(this.timer)
    }

    if (this.props.onChange !== undefined) {
      this.timer = setTimeout(() => {
        this.props.onChange(newValue, event)
      }, 500)
      this.setState({code: newValue})
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
      this.onSuggestCallback(suggestions.map(suggestion => {
        return {
          ...suggestion,
          kind: this.monaco.languages.CompletionItemKind.Text // chose Kind based on category?
        }
      }))
      this.onSuggestCallback = null
    }
  }

  renderErrors(errors) {
    const markers = errors.map(error => {
      return {
        ...error,
        endColumn: error.endColumn || this.editor.getModel().getLineContent(error.startLineNumber).length + 1,
        severity: error.severity === 'warning' ? this.monaco.Severity.Warning : this.monaco.Severity.Error
      }
    }, this);
    this.monaco.editor.setModelMarkers(this.editor.getModel(), '', markers)
  }

  render() {
    if (this.monaco && this.editor) {
      this.renderErrors(this.props.errors)
      this.renderSuggestions(this.props.suggestions)
    }

    const options = {
      theme: this.props.theme || 'vs',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: false
    }

    return (
      <div className="Editor">
        <MonacoEditor requireConfig={requireConfig}
                      height="800"
                      width="auto"
                      value={this.state.code}
                      options={options}
                      language={this.props.language}
                      onChange={this.onChange.bind(this)}
                      editorWillMount={this.editorWillMount.bind(this)}
                      editorDidMount={this.editorDidMount.bind(this)}/>
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

class DesignerEditorContainer extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.context.store.subscribe(this.updateErrorCursor.bind(this))
  }

  updateErrorCursor() {
    const {store} = this.context
    const {errorCursor} = store.getState().errorCursor
    if (this.editor && errorCursor && errorCursor.lineNumber !== -1) {
      this.editor.setPosition(new this.monaco.Position(errorCursor.lineNumber, errorCursor.column))
      const falseError = {
        startLineNumber: -1,
        startColumn: -1
      }
      store.dispatch(goToErrorAction(falseError))
    }
  }

  finishLoading(editor, monaco) {
    this.editor = editor
    this.monaco = monaco
  }

  render() {
    return (
      <DesignerEditor code={this.props.code}
                      onChange={this.props.onChange}
                      onSuggest={this.props.onSuggest}
                      suggestions={this.props.suggestions}
                      errors={this.props.errors}
                      language={this.props.language}
                      finishLoading={this.finishLoading.bind(this)}/>
    )
  }
}

DesignerEditorContainer.contextTypes = {
  store: React.PropTypes.object
}

export default DesignerEditorContainer