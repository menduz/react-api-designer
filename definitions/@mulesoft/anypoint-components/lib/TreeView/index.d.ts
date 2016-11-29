import * as React from 'react';

import LeafComponent = TreeView.LeafComponent;
import FolderComponent = TreeView.FolderComponent;

export default class TreeView extends React.Component<TreeViewProps, {}> {
    constructor(props: TreeViewProps);

    render(): JSX.Element;
}

export interface TreeViewNode {
    name: string;
    expanded?: boolean;
    children?: TreeViewNode[];
}

export interface TreeViewProps {
    /** Array of root objects */
    nodes: TreeViewNode[];
    /** Leaf component, it receives <br/><pre>{
       *   node: any,
       *   getName: (node) => any,
       *   onClick: (node) => void
       * }</pre> */
    leafComponent?: LeafComponent;
    /** Folder component, it receives <br/><pre>{
       *   node: any,
       *   getName: (node) => any,
       *   expanded: boolean,
       *   onClick: (node) => void
       * }</pre> */
    folderComponent?: FolderComponent;
    /** Placeholder component for empty folders */
    emptyComponent?: () => HTMLElement;

    /** function, returns the name or component for labeling any node. <br/>Receives the current node as argument. */
    getName?: (node: TreeViewNode) => string;
    /** function, returns the node's children array. <br/>Receives the current node as argument. */
    getChildren?: (node: TreeViewNode) => TreeViewNode[];
    /** function, returns a boolean if the node is a folder, undefined on any other scenario. <br/>Receives the current node as argument.  */
    getExpanded?: (node: TreeViewNode) => boolean;

    /** Max recursion level for rendering */
    maxDepth?: number;

    /** onClick function, attached to every node. Interface: <code>(node) => void</code> */
    onClick?: (node: TreeViewNode) => void;
    className?: string;
}


declare namespace TreeView {
    interface LeafComponent {
        node: TreeViewNode;
        getName: (node: TreeViewNode) => string;
        onClick: (node: TreeViewNode) => void;
    }

    interface FolderComponent extends LeafComponent{
        expanded: boolean;
    }
}
