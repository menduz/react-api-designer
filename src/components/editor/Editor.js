import React from 'react'
import {connect} from 'react-redux'
import MonacoEditor from 'react-monaco-editor'
import EmptyResult from '@mulesoft/anypoint-components/lib/EmptyResult'
import registerRamlLanguage from './languages/Raml'
import {suggest, updateCurrentFile} from './actions'
import './Editor.css'
import {getAll} from "./selectors"
import {getFileContent} from "../../repository-redux/selectors"

const requireConfig = {
  url: `${window.PUBLIC_URL || process.env.PUBLIC_URL}/static/js/vs/loader.js`,
  paths: {'vs': `${window.PUBLIC_URL || process.env.PUBLIC_URL}/static/js/vs`}
}

class DesignerEditor extends React.Component {
  constructor(props) {
    super(props)

    this.editor = null
    this.monaco = null

    this.language = this.props.language
    this.value = this.props.value
    this.position = this.props.position
    this.errors = this.props.errors

    // fix editor size
    window.addEventListener('resize', () => {
      if (this.editor) this.editor.layout()
    })
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (this.monaco && this.language) {
      if (nextProps.position !== this.position)
        this._revealPosition(nextProps.position)

      if (!this.language.native && nextProps.errors !== this.errors && (nextProps.errors.length !== 0 || this.errors.length !== 0))
        this._showErrors(nextProps.errors)

      if (this.onSuggestCallback)
        this._showSuggestions(nextProps.suggestions)
    }

    let update = false
    if (nextProps.language.id !== this.language.id) {
      this._changeLanguage(nextProps.language)
      update = true
    }

    if (nextProps.value !== this.value) {
      this.value = nextProps.value
      update = true
    }

    return update
  }

  _changeLanguage(language) {
    this.language = language
    if (this.monaco && this.language)
      this.monaco.editor.setModelLanguage(this.editor.getModel(), this.language.parent || this.language.id)
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

  _showSuggestions(suggestions) {
    this.onSuggestCallback(suggestions.map(suggestion => {
      return {
        ...suggestion,
        kind: suggestion.insertText.lastIndexOf(':') > -1 ?
          this.monaco.languages.CompletionItemKind.Property :
          this.monaco.languages.CompletionItemKind.Value // chose Kind based on category?
      }
    }))
    this.onSuggestCallback = null
  }

  _lineLength(line) {
    return this.editor.getModel().getLineLastNonWhitespaceColumn(Math.min(line, this.editor.getModel().getLineCount()))
  }

  _mapErrors(error) {
    if (error.trace) return this._mapErrors(error.trace)

    return {
      ...error,
      endColumn: error.endColumn || this._lineLength(error.startLineNumber),
      severity: error.isWarning ? this.monaco.Severity.Warning : this.monaco.Severity.Error
    }
  }

  _showErrors(errors) {
    this.errors = errors

    const markers = errors.map(error => this._mapErrors(error));
    this.monaco.editor.setModelMarkers(this.editor.getModel(), '', markers)
  }

  _revealPosition(position) {
    this.position = position

    if (position && position.line > -1) {
      const positionObj = new this.monaco.Position(position.line, position.column)
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
        {this.language.id ? '' : (<EmptyResult className="Empty" message="Select a file"/>)}
        <MonacoEditor options={options}
                      requireConfig={requireConfig}
                      context={window.electronAmdContext}
                      value={this.value}
                      language={this.language.parent || this.language.id}
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
  language: React.PropTypes.object,
  value: React.PropTypes.string,
  position: React.PropTypes.object,
  errors: React.PropTypes.arrayOf(React.PropTypes.object),
  suggestions: React.PropTypes.arrayOf(React.PropTypes.object),
  theme: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSuggest: React.PropTypes.func
}

const mapStateToProps = state => {
  const editor = getAll(state)
  const text = editor.path? getFileContent(state)(editor.path) || '' : ''

  return {
    language: editor.language,
    value: text,
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