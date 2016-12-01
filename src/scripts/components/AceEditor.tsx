import * as React from 'react';
import Editor = AceAjax.Editor;
import Annotation = AceAjax.Annotation;
import EditorCommand = AceAjax.EditorCommand;
import Position = AceAjax.Position;


export default class AceEditor extends React.PureComponent<AceEditorProps, {}> {
    private editor: Editor;

    private readonly mode: string;
    private readonly theme: string;
    private readonly height: string;
    private readonly width: string;

    constructor(props: AceEditorProps) {
        super(props);

        this.mode = props.mode || AceEditorDefaultProps.mode;
        this.theme = props.theme || AceEditorDefaultProps.theme;
        this.height = props.height || AceEditorDefaultProps.height;
        this.width = props.width || AceEditorDefaultProps.width;
    }

    private editorRef(): HTMLElement {
        return this.refs['editor'] as HTMLElement;
    }

    handleChange() { if (this.props.onChange) this.props.onChange(this.editor.getValue()) }

    componentDidMount() {
        this.editor = ace.edit(this.editorRef());

        this.editor.setTheme(`ace/theme/${this.theme}`);
        this.editor.getSession().setMode(`ace/mode/${this.mode}`);

        if (this.props.onChange) this.editor.getSession().on('change', this.handleChange.bind(this))
    }

    set value(value: string) { this.editor.setValue(value); }

    get value(): string { return this.editor.getValue(); }

    render() {
        const editorStyle = {height: this.height, width: this.width, display: this.props.display ? 'block' : 'none'};
        return <div ref="editor" id="editor" style={editorStyle}>{this.props.value}</div>;
    }
}

interface AceEditorProps {
    mode?: string;
    focus?: boolean;
    theme?: string;
    name?: string;
    className?: string;
    height?: string;
    width?: string;
    fontSize?: number;
    showGutter?: boolean;
    onChange?: (v: string) => void;
    onCopy?: () => void;
    onPaste?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onScroll?: () => void;
    value?: string;
    onLoad?: () => void;
    onBeforeLoad?: () => void;
    minLines?: number;
    maxLines?: number;
    readOnly?: boolean;
    highlightActiveLine?: boolean;
    tabSize?: number;
    showPrintMargin?: boolean;
    cursorStart?: number;
    editorProps?: {};
    setOptions?: {};
    annotations?: Annotation[];
    markers?: any[];
    keyboardHandler?: string;
    wrapEnabled?: boolean;
    enableBasicAutocompletion?: boolean,
    enableLiveAutocompletion?: boolean,
    commands?: EditorCommand[],
    display?: boolean;
}

interface ChangeEvent {
    action: 'insert' | 'remove';
    lines: string[];
    start: Position;
    end: Position;
}

const AceEditorDefaultProps = {
    mode: 'javascript',
    theme: 'monokai',
    height: '900px',
    width: '1000px'
};