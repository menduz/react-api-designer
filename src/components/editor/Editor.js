import React from 'react'
import {connect} from 'react-redux'
import MonacoEditor from 'react-monaco-editor'
import EmptyResult from '@mulesoft/anypoint-components/lib/EmptyResult'
import registerRamlLanguage from './languages/Raml'
import {suggest, updateCurrentFile, saveCurrentFile} from './actions'
import {getLanguage, getErrors, getSuggestions, getPosition, isReadOnly, getCurrentFilePath} from "./selectors"
import {getTheme} from "./../header/selectors"
import {getCurrentFileContent} from "../../repository-redux/selectors"
import './Editor.css'

class DesignerEditor extends React.Component {
  constructor(props) {
    super(props)

    this.editor = null
    this.monaco = null
    this.disposables = []

    this.theme = this.props.theme
    this.readOnly = this.props.readOnly
    this.language = this.props.language
    this.value = this.props.value
    this.path = this.props.path
    this.position = this.props.position
    this.errors = this.props.errors

    // fix editor size
    window.addEventListener('resize', () => {
      if (this.editor) this.editor.layout()
    })
  }

  shouldComponentUpdate(nextProps) {
    if (!this.monaco || !this.monaco.editor || !this.editor || !this.language)
      return false;


    if (nextProps.position !== this.position)
      this._revealPosition(nextProps.position)

    if (nextProps.theme !== this.theme)
      this._changeTheme(nextProps.theme)

    if (nextProps.readOnly !== this.readOnly)
      this._changeReadOnly(nextProps.readOnly)

    if (!this.language.native && nextProps.errors !== this.errors && (nextProps.errors.length !== 0 || this.errors.length !== 0))
      this._showErrors(nextProps.errors)

    if (this.onSuggestCallback)
      this._showSuggestions(nextProps.suggestions)

    let update = false
    if (nextProps.language.id !== this.language.id) {
      this._showErrors([])
      this._changeLanguage(nextProps.language)
      update = true
    }

    if (nextProps.value !== this.value) {
      this.value = nextProps.value
      this.editor.focus()
      update = true
    }

    if (nextProps.path && !nextProps.path.equalsTo(this.path)) {
      this.path = nextProps.value
      this.editor.focus()
      update = true
    }

    return update
  }

  _changeReadOnly(readOnly) {
    this.readOnly = readOnly
    this.editor.updateOptions({readOnly})
  }

  _changeTheme(theme) {
    this.theme = theme
    this.editor.updateOptions({theme})
  }

  _changeLanguage(language) {
    this.language = language
    if (this.language)
      this.monaco.editor.setModelLanguage(this.editor.getModel(), this.language.parent || this.language.id)
  }

  componentWillUnmount() {
    this.disposables.forEach(d => d.dispose())
  }

  editorWillMount(monaco) {
    this.disposables = registerRamlLanguage(monaco, (model, position) => {
      return new Promise((resolve) => {
        this.onSuggest(position, resolve)
      })
    })
  }

  editorDidMount(editor, monaco) {
    this.editor = editor
    this.monaco = monaco
    editor.focus()
    editor.getModel().updateOptions({tabSize: 2, wordBasedSuggestions: false})
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      this.props.onSave(this.value)
    });
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
    if (suggestions.length === 0) {
      // ugly hack to stop showing wordBasedSuggestions.
      // waiting for monaco fix: https://github.com/Microsoft/monaco-editor/issues/363
      this.onSuggestCallback([{
        label: 'No suggestions.',
        kind: this.monaco.languages.CompletionItemKind.Text,
        insertText: ''
      }])
    } else {
      this.onSuggestCallback(suggestions.map(suggestion => {
        return {
          ...suggestion,
          kind: suggestion.insertText.lastIndexOf(':') > -1 ?
            this.monaco.languages.CompletionItemKind.Property :
            this.monaco.languages.CompletionItemKind.Value // choose Kind based on category?
        }
      }))
    }
    this.onSuggestCallback = null
  }

  _lineLength(line) {
    return this.editor.getModel().getLineLastNonWhitespaceColumn(Math.min(line, this.editor.getModel().getLineCount()))
  }

  _mapErrors(errors, parentError) {
    let markers = []

    errors.forEach(error => {
      if (error.trace) {
        markers = markers.concat(this._mapErrors(error.trace, parentError || error))
      } else {
        const isWarning = parentError ? parentError.isWarning : error.isWarning
        markers.push({
          ...error,
          endColumn: error.endColumn || this._lineLength(error.startLineNumber),
          severity: isWarning ? this.monaco.Severity.Warning : this.monaco.Severity.Error
        })
      }
    })

    return markers
  }

  _showErrors(errors) {
    this.errors = errors
    this.monaco.editor.setModelMarkers(this.editor.getModel(), '', this._mapErrors(errors))
  }

  _revealPosition(position) {
    this.position = position

    if (position && position.line > -1) {
      const positionObj = new this.monaco.Position(position.line, position.column)
      this.editor.revealPositionInCenterIfOutsideViewport(positionObj)
      this.editor.setPosition(this.editor.getModel().validatePosition(positionObj))
      this.editor.focus()
    }
  }

  render() {
    const options = {
      theme: this.theme,
      readOnly: this.readOnly,
      selectOnLineNumbers: true,
      roundedSelection: false,
      cursorStyle: 'line',
      automaticLayout: false,
      folding: true,
      wordBasedSuggestions: false
    }

    return (
      <div className="Editor">
        {this.language.id ? '' : (<EmptyResult className="Empty" testId="Empty-Editor" message="Select a file"/>)}
        <MonacoEditor options={options}
                      value={this.value}
                      language={this.language.parent || this.language.id}
                      onChange={this.onChange.bind(this)}
                      editorWillMount={this.editorWillMount.bind(this)}
                      editorDidMount={this.editorDidMount.bind(this)}
                      testId="Editor"/>
      </div>
    )
  }
}

DesignerEditor.propTypes = {
  language: React.PropTypes.object,
  value: React.PropTypes.string,
  path: React.PropTypes.object,
  position: React.PropTypes.object,
  errors: React.PropTypes.arrayOf(React.PropTypes.object),
  suggestions: React.PropTypes.arrayOf(React.PropTypes.object),
  theme: React.PropTypes.string,
  readOnly: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onSuggest: React.PropTypes.func,
  onSave: React.PropTypes.func
}

const mapStateToProps = state => {
  return {
    value: getCurrentFileContent(state)(),
    path: getCurrentFilePath(state),
    language: getLanguage(state),
    position: getPosition(state),
    errors: getErrors(state),
    suggestions: getSuggestions(state),
    theme: getTheme(state),
    readOnly: isReadOnly(state)
  }
}

const mapDispatch = (dispatch) => {
  return {
    onChange: (value) => dispatch(updateCurrentFile(value, 500)),
    onSuggest: (value, offset) => dispatch(suggest(value, offset)),
    onSave: (value) => dispatch(saveCurrentFile())
  }
}

export default connect(mapStateToProps, mapDispatch)(DesignerEditor)