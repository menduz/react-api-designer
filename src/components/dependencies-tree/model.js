// @flow

import {Set} from 'immutable'
import {List} from 'immutable'
import {RepositoryModel, FileModel, DirectoryModel, ElementModel} from '../../repository/immutable/RepositoryModel';
import Path from "../../repository/Path";

export type State = {
  updating: boolean,
  currentPath: ?Path,
  expandedFolders: Set<string>
}

export type Node = {
  path: Path,
  name: string,
  isDirty?: boolean,
  children?: Node[],
  filePath: Path
}

const fromFile = (file: FileModel, rootPath:string, name: string): Node => {
  return {
    path: Path.fromString(file.path.toString().replace(rootPath,'/' + name)),
    filePath: file.path,
    name: file.name,
    label: file.name
  }
}

const fromElement = (element: ElementModel, rootPath: string, name: string): Node => {
  return element.isDirectory()
    // eslint-disable-next-line
    ? fromDirectory(element.asDirectoryModel(), rootPath, name)
    : fromFile(element.asFileModel(), rootPath, name)
}

const fromDirectory = (directory: DirectoryModel, rootPath: string, name: string): Node => {
  const children = directory.children.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (b.isDirectory() && !a.isDirectory()) return 1;
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  }).map(c => fromElement(c, rootPath, name)).toArray();

  const p = Path.fromString(directory.path.toString().replace(rootPath,'/' + name))
  return {
    path: p,
    filePath: directory.path,
    name: directory.name,
    label: directory.name,
    children
  }
}

const buildRootNode = (groupId:ElementModel, assetId:ElementModel, version:ElementModel, children:List<ElementModel>): Node => {
  const name = groupId.name + ":" + assetId.name + ":" + version.name
  const p = groupId.name + "_" + assetId.name + "_" + version.name
  return {
    path: Path.fromString('/' + p),
    filePath: version.path,
    name: p,
    label: name,
    gav:{ groupId: groupId.name , assetId: assetId.name ,version: version.name},
    children: children.map(c => fromElement(c, version.path.toString(), p)).toArray()
  }
}

export const fromFileTree = (fileTree: RepositoryModel) : Node[] => {
  const exchangeModules = fileTree.getByPathString('exchange_modules')
  let result = []

  if (exchangeModules) {
    if (exchangeModules.isDirectory()) {
      const d = exchangeModules.asDirectoryModel()
      d.children.forEach( g => {
        const groupId = g.asDirectoryModel()
        return groupId.children.forEach( a => {
          const assetId = a.asDirectoryModel()
          return assetId.children.forEach( v => {
            const version = v.asDirectoryModel()
            result.push(buildRootNode(groupId, assetId, version, version.children))
          })
        })
      })
      return result
    } else {
      return []
    }
  } else {
    return []
  }
}