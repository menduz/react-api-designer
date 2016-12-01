import * as React from 'react';

import {AppState, FilesState, SelectedElementState} from "../reducers/index";
import {Store} from "react-redux";
import Editors from "../components/Editors";
import {Map} from 'immutable';
import {Path} from "../repository/Path";
import {Repository} from "../repository/immutable/Repository";
import {contentChanged} from "../actions/repository";

class EditorsContainer extends React.Component<EditorsContainerProps, {}> {
    constructor(props: EditorsContainerProps, context: EditorsContainerContext) {
        super(props, context);

        context.store.subscribe(this.storeUpdated.bind(this));
    }

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    private currentState(): AppState { return this.getContext().store.getState() }

    private getContext(): EditorsContainerContext { return this.context as EditorsContainerContext; }

    private storeUpdated() {
        const appState = this.currentState();

        const contents = appState.get(FilesState, Map<string, string>());
        this.getEditorsRef().updateContents(contents);

        const element = appState.get(SelectedElementState) as Repository.Element;
        if (element) {
            this.getEditorsRef().updateSelectedFile(element.path.toString());
        }
    }

    private handleChange(path: string, value: string) {
        // this.getContext().store.dispatch(contentChanged(Path.fromString(path), value))
    }

    private getEditorsRef(): Editors { return this.refs['editors'] as Editors; }

    render(): JSX.Element {

        return <Editors onChange={this.handleChange.bind(this)} ref="editors"/>
    }

}

interface EditorsContainerProps {}

interface EditorsContainerContext {
    store: Store<AppState>
}

export default EditorsContainer;