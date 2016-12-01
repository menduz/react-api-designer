import * as React from 'react';
import AceEditor from "./AceEditor";
import {Map} from 'immutable';

export default class Editors extends React.PureComponent<EditorsProps, EditorsState> {
    constructor(props: EditorsProps) {
        super(props);

        this.state = {
            selectedFile: props.selectedFile,
            contents : props.contents || Map<string, string>(),
            editors: Map<string, JSX.Element>()
        }
    }


    private editorRef(): AceEditor {
        return this.refs['editor'] as AceEditor;
    }

    // componentDidMount() {
    //     const aceEditor = this.editorRef();
    //     if(aceEditor) aceEditor.value = this.state.contents.get(this.state.selectedFile, 'Pepepe')
    // }
    //
    // componentDidUpdate() {
    //     const aceEditor = this.editorRef();
    //     if(aceEditor) aceEditor.value = this.state.contents.get(this.state.selectedFile, 'Pepepe')
    // }

    updateContents(contents: Map<string, string>) {
        this.setState({
            contents: contents,
            selectedFile: this.state.selectedFile,
            editors: this.state.editors
        })
    }

    updateSelectedFile(selectedFile: string) {
        this.setState({
            contents: this.state.contents,
            selectedFile: selectedFile,
            editors: this.state.editors
        })
    }

    handleChange(key: string,  value: string) {
        if (this.props.onChange) this.props.onChange(key, value)
    }

    render(): JSX.Element {
        if(!this.state.selectedFile) return <div>Nada de nada</div>;
        //
        // const currentEditor = this.state.editors.get(this.state.selectedFile);
        // if(currentEditor) return currentEditor;
        //
        // const content = this.state.contents.get(this.state.selectedFile);
        // const editor = <AceEditor ref="editor" content={content} mode="yaml"/>;
        // this.state.editors = this.state.editors.set(this.state.selectedFile, editor);
        // return editor;
        return <div>
            {this.state.contents.map((content, key) => {
                return <AceEditor
                    display={this.state.selectedFile === key}
                    key={key}
                    onChange={this.handleChange.bind(this, key)}
                    ref="editor"
                    value={content}
                    mode="yaml"/>
            }).toArray()}
        </div>
    }
}

interface EditorsProps {
    selectedFile?: string;
    contents?: Map<string, string>;
    onChange?: (k: string, v: string) => void;
}

interface EditorsState {
    selectedFile: string;
    editors: Map<string, JSX.Element>;
    contents: Map<string, string>;
}