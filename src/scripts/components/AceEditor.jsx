"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var AceEditor = (function (_super) {
    __extends(AceEditor, _super);
    function AceEditor(props) {
        _super.call(this, props);
        this.mode = props.mode || AceEditorDefaultProps.mode;
        this.theme = props.theme || AceEditorDefaultProps.theme;
        this.height = props.height || AceEditorDefaultProps.height;
        this.width = props.width || AceEditorDefaultProps.width;
    }
    AceEditor.prototype.editorRef = function () {
        return this.refs['editor'];
    };
    AceEditor.prototype.componentDidMount = function () {
        this.editor = ace.edit(this.editorRef());
        this.editor.setTheme("ace/theme/" + this.theme);
        this.editor.getSession().setMode("ace/mode/" + this.mode);
        if (this.props.onChange)
            this.editor.getSession().on('change', this.props.onChange);
    };
    Object.defineProperty(AceEditor.prototype, "value", {
        get: function () { return this.editor.getValue(); },
        set: function (value) { this.editor.setValue(value); },
        enumerable: true,
        configurable: true
    });
    AceEditor.prototype.render = function () {
        var editorStyle = { height: this.height, width: this.width };
        return <div ref="editor" id="editor" style={editorStyle}></div>;
    };
    return AceEditor;
}(React.PureComponent));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AceEditor;
var AceEditorDefaultProps = {
    mode: 'javascript',
    theme: 'monokai',
    height: '900px',
    width: '1000px'
};
