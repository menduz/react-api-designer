import * as React from "react";

import ActionBar, {ActionBarElement} from '@mulesoft/anypoint-components/lib/ActionBar';

export default class TopMenu extends React.Component<TopMenuProps, {}> {
    constructor(props: TopMenuProps) {
        super(props);
    }

    render() {
        const actions: ActionBarElement[] = [
            {
                icon: 'plus',
                label: 'Add File',
                onClick: this.props.onAddFile,
                testId: 'add-file',
            },
            {
                icon: 'plus',
                label: 'Add Directory',
                onClick: this.props.onAddDirectory,
                testId: 'add-directory',
            },
            {
                icon: 'save',
                label: 'Save',
                onClick: this.props.onSaveFile,
                testId: 'save-file',
            }
        ];

        return (
            <ActionBar actions={actions}/>
        );
    }
}

interface TopMenuProps {
    onAddFile: () => void;
    onAddDirectory: () => void;
    onSaveFile: () => void;
}

