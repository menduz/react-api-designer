// @flow

import {Map} from 'immutable'
import {FileTree} from './FileTree'

export type State = {
    fileTree: ?FileTree,
    contents: Map<string, string>
}