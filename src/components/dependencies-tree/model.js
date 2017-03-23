// @flow

import {Set} from 'immutable'
import {Path} from '../../repository'
import {RepositoryModel, FileModel, DirectoryModel, ElementModel} from '../../repository/immutable/RepositoryModel';

export type State = {
  currentPath: ?Path,
  expandedFolders: Set<Path>
}

export type Node = {
  path: Path,
  name: string,
  isDirty: boolean,
  children?: Node[]
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

const buildRootNode = (groupId, assetId, version, children): Node => {
  const name = groupId.name + ":" + assetId.name + ":" + version.name
  const p = groupId.name + "_" + assetId.name + "_" + version.name
  return {
    path: Path.fromString('/' + p),
    filePath: version.path,
    name: p,
    label: name,
    gav:{ groupId: groupId.name , assetId: assetId.name ,version: version.name},
    children: children.map(c => fromElement(c, version.path, p)).toArray()
  }
}

export const fromFileTree = (fileTree: RepositoryModel) : Node[] => {
  const exchangeModules = fileTree.getByPathString('exchange_modules')
  let result = []

  if (exchangeModules) {
    if (exchangeModules.isDirectory()) {
      const d = exchangeModules.asDirectoryModel()
      d.children.forEach( groupId => {
        return groupId.children.forEach( assetId => {
          return assetId.children.forEach( version => {
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