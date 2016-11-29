import {Map} from 'immutable';
import {connect, Dispatch} from 'react-redux'
import TreeView, {TreeViewNode} from '@mulesoft/anypoint-components/lib/TreeView'

import {Repository} from '../repository/immutable/repository'
import Directory = Repository.Directory;
import Element = Repository.Element;
import File = Repository.File;
import {Actions} from "../actions/index";
import {Path} from "../repository/Path";
import {AppState, RepositoryState, ExpandedDirectoriesState} from "../reducers/index";

interface RepositoryNode extends TreeViewNode {
    path: Path
}

const nodeFromElement = (expandedDirs: Map<string, boolean>, element: Element): RepositoryNode => {
    if (element.isDirectory()) return nodeFromDirectory(expandedDirs, element as Directory);
    return nodeFromFile(element as File);
};

const nodeFromDirectory = (expandedDirs: Map<string, boolean>, directory: Directory): RepositoryNode => {
    return {
        name: directory.name,
        path: directory.path,
        expanded: expandedDirs.get(directory.path.toString(), false),
        children: directory.children.map((c) => nodeFromElement(expandedDirs, c)).toArray()
    };
};

const nodeFromFile = (file: File): RepositoryNode => {
    return {
        name: file.name,
        path: file.path
    };
};


interface StateProps {
    nodes: TreeViewNode[];
}

function mapStateToProps(state: AppState): StateProps {
    const repository = state.get(RepositoryState, Repository.empty());
    const expandedDirs = state.get(ExpandedDirectoriesState, Map<string, Repository.Element>());

    return {
        nodes: repository.root.children
            .map((c: Repository.Element) => nodeFromElement(expandedDirs, c))
            .toArray()
    }
}

interface DispatchProps {
    onClick?: (n : TreeViewNode) => void;
}

function mapDispatchToProps(dispatch: Dispatch<AppState>): DispatchProps {
    return {
        onClick: (node: TreeViewNode) => {
            dispatch({type: Actions.SELECT_ELEMENT, path: (node as RepositoryNode).path });
        }
    }
}

const TreeViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TreeView);

export default TreeViewContainer