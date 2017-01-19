// @flow

import {Set} from 'immutable'
import type {State} from './model'
import {FILE_ADDED, DIRECTORY_ADDED, NODE_SELECTED, TREE_CHANGED, INIT_FILE_SYSTEM} from './actions'

const initialState: State = {
    fileSystem: undefined,
    currentNode: undefined,
    expandedFiles: Set()
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
    switch (action.type) {
        case INIT_FILE_SYSTEM:
            return {
                ...state,
                fileSystem: action.payload
            }
        case FILE_ADDED:
            if (!state.fileSystem) return state
            return {
                ...state,
                fileSystem: state.fileSystem.updateElement(action.payload)
            }
        case DIRECTORY_ADDED:
            if (!state.fileSystem) return state
            return {
                ...state,
                fileSystem: state.fileSystem.updateElement(action.payload)
            }
        case NODE_SELECTED:
            return {
                ...state,
                currentNode: action.payload
            }
        case TREE_CHANGED:
        default:
            return state
    }
}

export default reducer