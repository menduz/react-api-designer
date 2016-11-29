import * as React from "react";

import Row from '@mulesoft/anypoint-components/lib/Row';

import TreeView from '../containers/TreeViewContainer'
import TopMenu from '../containers/TopMenuContainer'

import AceEditor from "./AceEditor";


export default class ApiDesigner extends React.Component<ApiDesignerProps, {}> {
    constructor(props: ApiDesignerProps) {
        super(props);

        // Just for testing
        var globalMap = (window as {[key: string]: any});
        globalMap['globalSetText'] = (text: string) => {
            this.editorRef().value = text
        };
        globalMap['globalGetText'] = () => {
            return this.editorRef().value
        };
    }

    private editorRef(): AceEditor {
        return this.refs['editor'] as AceEditor;
    }

    private onChange(value: string) {
        console.log(this.editorRef().value);
        console.log(value);
    }

    componentDidMount() {
        this.editorRef().value =
            `#%RAML 1.0
title: My Api
baseUri: http://someapi.com/api/`;
    }

    render() {
        return (
            <div>
                <Row>
                    <TopMenu/>
                </Row>
                <Row>
                    <div>
                        <TreeView/>
                    </div>
                    <div>
                        <AceEditor ref="editor" onChange={this.onChange.bind(this)} mode="yaml"/>
                    </div>
                </Row>
            </div>
        );
    }
}

interface ApiDesignerProps {
}

