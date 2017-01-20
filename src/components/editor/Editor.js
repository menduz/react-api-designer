import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import {connect} from 'react-redux'
import registerRamlLanguage from './languages/Raml'
import {suggest, updateCurrentFile} from './actions'
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

    this.language = this.props.language;
    this.value = this.props.value;
    this.position = this.props.position;
    this.errors = this.props.errors;
    this.suggestions = this.props.suggestions;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.position !== this.position) {
      this.position = nextProps.position
      this._revealPosition(this.position)
    }
    if (DesignerEditor._arraysChanged(nextProps.errors, this.errors)) {
      this.errors = nextProps.errors
      this._renderErrors(this.errors)
    }
    if (DesignerEditor._arraysChanged(nextProps.suggestions, this.suggestions)) {
      this.suggestions = nextProps.suggestions
      this._renderSuggestions(this.suggestions)
    }

    let update = false
    if (nextProps.value !== this.value) {
      this.value = nextProps.value
      update = true
    }
    if (nextProps.language !== this.language) {
      this.language = nextProps.language
      update = true
    }
    return update
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
  }

  onChange(newValue, event) {
    this.value = newValue

    if (this.props.onChange) {
      this.props.onChange(newValue, event)
    }
  }

  onSuggest(position, resolve) {
    if (this.props.onSuggest) {
      if (this.onSuggestCallback) {
        // resolve any pending promise before replacing
        this.onSuggestCallback([])
      }
      this.onSuggestCallback = resolve
      this.props.onSuggest(this.value, position)
    }
  }

  _renderSuggestions(suggestions) {
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

  _renderErrors(errors) {
    if (!this.monaco) return

    const markers = errors.map(error => {
      return {
        ...error,
        endColumn: error.endColumn || this._lineLength(error.startLineNumber),
        severity: error.severity === 'warning' ? this.monaco.Severity.Warning : this.monaco.Severity.Error
      }
    });
    this.monaco.editor.setModelMarkers(this.editor.getModel(), '', markers)
  }

  _lineLength(line) {
    return this.editor.getModel().getLineLastNonWhitespaceColumn(Math.min(line, this.editor.getModel().getLineCount()));
  }

  _revealPosition(position) {
    if (!this.monaco) return

    if (position && position.line > -1) {
      const positionObj = new this.monaco.Position(position.line, position.column);
      this.editor.revealPositionInCenterIfOutsideViewport(positionObj)
      this.editor.setPosition(this.editor.getModel().validatePosition(positionObj))
    }
  }

  render() {
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
                      options={options}
                      value={this.value}
                      language={this.language}
                      onChange={this.onChange.bind(this)}
                      editorWillMount={this.editorWillMount.bind(this)}
                      editorDidMount={this.editorDidMount.bind(this)}/>
      </div>
    )
  }

  static _arraysChanged(array1, array2) {
    return array1 !== array2 && (array1.length !== 0 || array2.length !== 0)
  }
}

DesignerEditor.propTypes = {
  language: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  position: React.PropTypes.object,
  errors: React.PropTypes.arrayOf(React.PropTypes.object),
  suggestions: React.PropTypes.arrayOf(React.PropTypes.object),
  theme: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSuggest: React.PropTypes.func
}


const mapStateToProps = state => {
  const {editor} = state
  return {
    language: editor.language,
    value: editor.text,
    position: editor.position,
    errors: editor.errors,
    suggestions: editor.suggestions,
    theme: editor.theme
  }
}

const mapDispatch = (dispatch) => {
  return {
    onChange: (value) => dispatch(updateCurrentFile(value, 500)),
    onSuggest: (text, offset) => dispatch(suggest(text, offset))
  }
}

export default connect(mapStateToProps, mapDispatch)(DesignerEditor)