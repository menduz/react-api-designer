// @flow

import type {RepositoryElementType} from '../../../src/repository/type'
import {RepositoryTypeHelper} from '../../../src/repository/type'

import {RequestFileFunction} from '../types'

class FSResolverExtImpl {
  _requestFile: RequestFileFunction
  _helper: RepositoryTypeHelper

  constructor(requestFile: RequestFileFunction, repositoryType: RepositoryElementType) {
    this._requestFile = requestFile
    this._helper = new RepositoryTypeHelper(repositoryType)
  }

  /**
   * Lists directory contents.
   * @param path
   */
  list(path: string): string[] {
    throw new Error('RamlSuggest should call listAsync instead of content. list: ' + path)
  }

  /**
   * Lists directory contents.
   * @param path
   */
  listAsync(path: string): Promise<string[]> {
    return Promise.resolve(this._helper.directoryChildrenNames(path))
  }

  /**
   * Checks item existence.
   * @param path
   */
  exists(path: string): boolean {
    throw new Error('RamlSuggest should call existsAsync instead of exists. File: ' + path)
  }

  /**
   * Checks item existence.
   * @param path
   */
  existsAsync(path: string): Promise<boolean> {
    return Promise.resolve(this._helper.exists(path))
  }

  /**
   * Check whether the path points to a directory.
   * @param path
   */
  isDirectory(path: string): boolean {
    throw new Error('RamlSuggest should call isDirectoryAsync instead of isDirectory. File: ' + path)
  }

  /**
   * Check whether the path points to a directory.
   * @param path
   */
  isDirectoryAsync(path: string): Promise<boolean> {
    return Promise.resolve(this._helper.isDirectory(path))
  }

  /**
   * File contents by full path, synchronously.
   * @param path
   */
  content(path: string): string {
    throw new Error('RamlSuggest should call contentAsync instead of content. File: ' + path)
  }

  /**
   * File contents by full path, asynchronously.
   * @param path
   */
  contentAsync(path: string): Promise<string> {
    return this._requestFile(path)
  }

  /**
   * Gets directory name by full path.
   * @param path
   */
  dirname(path: string): string {
    return this._helper.fileDirectory(path)
  }

  /**
   * Resolves one path against another.
   * @param contextPath - path to resolve against.
   * @param relativePath - relative path to resolve.
   */
  resolve(contextPath: string, relativePath: string): string {
    if (relativePath.startsWith('/')) return relativePath

    const pathBeginning = contextPath.endsWith('/') ? contextPath : contextPath + '/'
    return pathBeginning + relativePath
  }

  /**
   * Returns file extension name.
   * @param path
   */
  extname(path: string): string {
    return this._helper.fileExtension(path)
  }
}

export default FSResolverExtImpl