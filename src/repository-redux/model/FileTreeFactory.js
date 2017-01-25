// @flow

import {List} from 'immutable'

import {Path} from '../../repository'
import File from '../../repository/File'
import Element from '../../repository/Element'
import Directory from '../../repository/Directory'
import Repository from '../../repository/Repository'

import {FileModel, DirectoryModel, FileTree, ElementModel} from './FileTree'

export default class FileTreeFactory {
  static fileTree(repository: Repository) {
    return new FileTree(FileTreeFactory.directoryModel(repository.root))
  }

  static directoryModel(directory: Directory): DirectoryModel {
    const children = List.of(... directory.children)
      .map((element) => FileTreeFactory.elementModel(element))
      .toList()

    return DirectoryModel.directory(directory.name,
      directory.path,
      children)
  }

  static fileModel(file: File): FileModel {
    return new FileModel(file.name, file.path, file.dirty)
  }

  static elementModel(element: Element): ElementModel {
    if (element.isDirectory()) return FileTreeFactory.directoryModel(((element: any): Directory))

    return FileTreeFactory.fileModel(((element: any): File))
  }
}