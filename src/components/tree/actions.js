// @flow

import {PREFIX} from './index'

import {Repository} from '../../repository'

import type {Node} from './model'

import * as editor from "../editor";
import * as repository from "../../repository-redux";
import {File} from "../../repository";
import {getCurrentDirectory} from "./selectors";
import {Path} from '../../repository';

export const NODE_SELECTED = `DESIGNER/${PREFIX}/NODE_SELECTED`
export const PATH_SELECTED = `DESIGNER/${PREFIX}/PATH_SELECTED`
export const TREE_CHANGED = `DESIGNER/${PREFIX}/TREE_CHANGED`

type Action = {type: any}
type Dispatch = (action: Action) => void;
type GetState = () => {[key: string]: any}
type ExtraArgs = {repositoryContainer: {repository: Repository}}

export const treeChanged = (tree: Node) => ({
  type: TREE_CHANGED,
  payload: tree
})

export const pathSelected = (path: Path) => ({
  type: PATH_SELECTED,
  payload: path
})

export const nodeSelected = (node: Node) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
    dispatch({
      type: NODE_SELECTED,
      payload: node.path
    })


    if (!repositoryContainer.isLoaded) return
    const repository: Repository = repositoryContainer.repository
    const element = repository.getByPath(node.path);
    if (!element || element.isDirectory()) return

    const path = editor.selectors.getCurrentFilePath(getState());
    if (path === node.path.toString()) return

    const file: File = ((element: any): File);
    file.getContent()
      .then((content) => {
        dispatch(editor.actions.updateFile(content, node.path))
      })
  }

export const addFile = (name: string, fileType: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const directory = getCurrentDirectory(getState());
    dispatch(repository.actions.addFile(directory, name, fileType))
    dispatch(pathSelected(directory.path.append(name)))
  }

export const addDirectory = (name: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const directory = getCurrentDirectory(getState());
    dispatch(repository.actions.addDirectory(directory, name))
  }
