// @flow

import FileSystem from './FileSystem'
import type {Path, Entry, FileData} from './FileSystem'
import {fileEntry, folderEntry} from './FileSystem'


class ElectronFileSystem extends FileSystem {
  baseDir: string
  fs: any

  constructor(baseDir: Path) {
    super()
    this.baseDir = baseDir
    this.fs = window.nodeRequire('fs')
    if (!this.fs) throw new Error('Could not load window.nodeRequire("fs"). Are you running NativeFileSystem in an Electron context?')
  }

  path(path: Path): string {
    return this.baseDir + (path.startsWith('/') ? path : '/' + path)
  }

  toEntries(dir: string): Entry[] {
    return this.fs.readdirSync(dir).filter(f => !f.startsWith('.')).map(f => {
      const p = dir + f
      return this.isDirectory(p)
        ? folderEntry(f, p, this.toEntries(p + FileSystem.Separator))
        : fileEntry(f, p)
    })
  }

  directory(path: Path): Promise<Entry> {
    return new Promise((resolve) => {
      resolve(folderEntry(path, this.path(path), this.toEntries(this.path(path))))
    })
  }

  save(entries: FileData[]): Promise<Entry> {
    return new Promise((resolve) => {
      // save all sync
      entries.forEach(({path, content}) => {
        this.fs.writeFileSync(this.path(path), content)
      })

      resolve(this.directory(FileSystem.Separator))
    })
  }

  createFolder(path: Path): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fs.mkdir(this.path(path), (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

  load(path: Path): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fs.readFile(this.path(path), 'utf8', (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }

  remove(path: Path): Promise<any> {
    return new Promise((resolve, reject) => {
      const p = this.path(path)
      if (this.isDirectory(p)) {
        this.removeDirectory(p)
        resolve()
      } else {
        this.fs.unlink(p, (err) => {
          err ? reject(err) : resolve()
        })
      }
    })
  }

  rename(source: Path, destination: Path, isDirectory: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fs.rename(this.path(source), this.path(destination), (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

  isDirectory(path) {
    return this.fs.lstatSync(path).isDirectory()
  }

  removeDirectory(path) {
    if (this.fs.existsSync(path)) {
      this.fs.readdirSync(path).forEach(file => {
        const curPath = path + '/' + file
        if (this.isDirectory(curPath)) {
          // recurse
          this.removeDirectory(curPath)
        } else {
          // delete file
          this.fs.unlinkSync(curPath)
        }
      })
      this.fs.rmdirSync(path)
    }
  };
}

export default ElectronFileSystem