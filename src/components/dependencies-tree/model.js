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

const fromFile = (file: FileModel, name: string): Node => {
  return {
    path: Path.fromString(file.path.toString().replace('/exchange_modules','/' + name)),
    name: file.name,
    label: `${file.dirty ? '* ' : ''}${file.name}`
  }
}

const fromElement = (element: ElementModel, name: string): Node => {
  return element.isDirectory()
    // eslint-disable-next-line
    ? fromDirectory(element.asDirectoryModel(), name)
    : fromFile(element.asFileModel(), name)
}

const fromDirectory = (directory: DirectoryModel, name: string): Node => {
  const children = directory.children.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (b.isDirectory() && !a.isDirectory()) return 1;
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  }).map(c => fromElement(c, name)).toArray();

  const p = Path.fromString(directory.path.toString().replace('/exchange_modules','/' + name))
  console.log("fromDirectory " + p.toString())
  return {
    path: p,
    name: directory.name,
    label: directory.name,
    children
  }
}

export const fromFileTree = (fileTree: RepositoryModel) : Node[] => {
  const exchangeModules = fileTree.getByPathString('exchange_modules')
  if (exchangeModules) {
    if (exchangeModules.isDirectory()) {
      const d = exchangeModules.asDirectoryModel()
      return d.children.map( groupId => {
        //@@TODO LECKO This has an issue when you have 2 or more dependencies of same group/asset
        const assetId = groupId.children.get(0);
        const version = assetId.children.get(0);
        const name = groupId.name + ":" + assetId.name + ":" + version.name
        const p = groupId.name + "_" + assetId.name + "_" + version.name
        return {path: Path.fromString('/' + p), name: p, label: name,
          gav:{ groupId: groupId.name , assetId: assetId.name ,version: version.name},
          children: [
            { path: Path.fromString('/' + p + '/' + groupId.name),
              name:groupId.name,
              label: groupId.name,
              children: groupId.children.map(c => fromElement(c, p)).toArray()
            }]
        }
      }).toArray()
    } else {
      return []
    }
  } else {
    return []
  }
}