// @flow

import {PREFIX} from './index'

import {Repository} from '../../repository'

import type {Node} from './model'
import type {Dispatch, GetState, ExtraArgs} from '../../types/types'

import * as editor from "../editor";
import * as repository from "../../repository-redux";
import {File} from "../../repository";
import {getCurrentDirectory} from "./selectors";
import {Path} from '../../repository';

export const NODE_SELECTED = `DESIGNER/${PREFIX}/NODE_SELECTED`
export const PATH_SELECTED = `DESIGNER/${PREFIX}/PATH_SELECTED`
export const TREE_CHANGED = `DESIGNER/${PREFIX}/TREE_CHANGED`

export const treeChanged = (tree: Node) => ({
  type: TREE_CHANGED,
  payload: tree
})

export const pathSelected = (path: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
    dispatch({
      type: NODE_SELECTED,
      payload: path
    })

    if (!repositoryContainer.isLoaded) return
    const repository: Repository = repositoryContainer.repository
    const element = repository.getByPath(path);
    if (!element || element.isDirectory()) return

    const currentPath = editor.selectors.getCurrentFilePath(getState());
    if (currentPath === path.toString()) return

    const file: File = ((element: any): File);
    return file.getContent()
      .then((content) => {
        dispatch(editor.actions.updateFile(content, path))
      })
  }

export const addFile = (name: string, fileType?: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const directory = getCurrentDirectory(getState());
    dispatch(repository.actions.addFile(directory.path, name, fileType))
    dispatch(pathSelected(directory.path.append(name)))
  }

export const addDirectory = (name: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const directory = getCurrentDirectory(getState());
    dispatch(repository.actions.addDirectory(directory.path, name))
  }
