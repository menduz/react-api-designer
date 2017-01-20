import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import {connect} from 'react-redux'
import registerRamlLanguage from './languages/Raml'
import {parseText, suggest} from './actions'
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
      value: props.value
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
  }

  onChange(newValue, event) {
    this.setState({value: newValue})

    if (this.timer) {
      clearTimeout(this.timer)
    }

    if (this.props.onChange !== undefined) {
      this.timer = setTimeout(() => {
        this.props.onChange(this.state.value)
      }, 500)
    }
  }

  onSuggest(position, resolve) {
    if (this.props.onSuggest !== undefined) {
      if (this.onSuggestCallback) {
        // resolve any pending promise before replacing
        this.onSuggestCallback([])
      }
      this.onSuggestCallback = resolve
      this.props.onSuggest(this.state.value, position)
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
    line = Math.min(line, this.editor.getModel().getLineCount());
    return this.editor.getModel().getLineContent(line).length + 1;
  }

  _renderCursor(cursor) {
    if (cursor && cursor.line > -1) {
      this.editor.setPosition(new this.monaco.Position(cursor.line, cursor.column))
    }
  }

  render() {
    if (this.monaco && this.editor) {
      this._renderErrors(this.props.errors)
      this._renderSuggestions(this.props.suggestions)
      this._renderCursor(this.props.cursor);
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
                      value={this.state.value}
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
  value: React.PropTypes.string,
  cursor: React.PropTypes.object,
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
    cursor: editor.cursor,
    errors: editor.errors,
    suggestions: editor.suggestions,
    theme: editor.theme
  }
}

const mapDispatch = dispatch => {
  return {
    onChange: value => dispatch(parseText(value)),
    onSuggest: (text, offset) => dispatch(suggest(text, offset))
  }
}

export default connect(mapStateToProps, mapDispatch)(DesignerEditor)