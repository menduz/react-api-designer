/**
 * Created by lecko on 1/17/17.
 */

export default class ContentProvider {

  constructor(content) {
    this.content = content
  }

  contentDirName(content) {
    return '';
  }

  dirName(childPath ) {
    return '';
  }

  exists(checkPath ) {
    return true;
  }

  resolve(contextPath , relativePath ) {
    return '';
  }

  isDirectory(dirPath ) {
    return false;
  }

  readDir(dirPath) {
    return '';
  }

  existsAsync(path) {
    return Promise.resolve("path");
  }

  readDirAsync(path) {
    return Promise.resolve([]);
  }

  isDirectoryAsync(path) {
    return Promise.resolve(false);
  }
}