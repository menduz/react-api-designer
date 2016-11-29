import * as React from 'react';

declare class TreeMenu extends React.Component<TreeMenu.TreeMenuProps, {}> {
    constructor(props: TreeMenu.TreeMenuProps);

    render(): JSX.Element;
}

declare namespace TreeMenu {
    interface TreeMenuProps {
        stateful?: boolean;
        classNamePrefix?: string;
        identifier?: string;
        onTreeNodeClick?: (v: any) => void;
        onTreeNodeCheckChange?: (v: any) => void;
        onTreeNodeSelectChange?: (v: any) => void;
        collapsible?: boolean;
        expandIconClass?: string;
        collapseIconClass?: string;
        data?: DataNode | DataNode[];
        labelFilter?: (v: any) => void;
        labelFactory?: (v: any) => void;
        checkboxFactory?: (v: any) => void;
        sort?: boolean | ((v: any) => boolean);
    }

    interface DataNode {
        label: string;
        checkbox?: boolean;
        children?: DataNode[];
        collapsible?: boolean;
    }
}

export default class api {
    TreeMenu: TreeMenu
}