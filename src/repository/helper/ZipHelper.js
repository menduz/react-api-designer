// @flow
import Directory from '../Directory'
import Element from '../Element'
import Repository from '../Repository'

import JSZip from 'jszip'


class ZipHelper {

  static buildZip(root:Directory):Promise<> {
    const zip = new JSZip

    function addToZip(element:Element, parentDirZip: JSZip):Promise<> {
      if (element.isDirectory()) {
        const zipFolder = parentDirZip.folder(element.name)
        if (element.children.isEmpty) return Promise.resolve()
        return Promise.all(element.children.map(c => {
          return addToZip(c, zipFolder)
        }))
      } else {
        return element.getContent().then(content => {
          parentDirZip.file(element.name, content)
        })
      }

    }

    return Promise.all (root.children.map(c => {
      return addToZip(c, zip)
    })).then(() => {
      return zip.generateAsync({type:"blob"})
    })
  }

  static filesContents(content:any, files:Array) {

    function buildContents(zip, files) {
      return Promise.all(files.map(f => {
        return zip.files[f.filename].async('string').then(c => {
          return {filename: f.filename, content:c}
        })
      }))
    }

    var zip = new JSZip();
    return zip.loadAsync(content).then(zip => {
      if (files) {
        return buildContents(zip, files)
      } else {
        const files = Object.keys(zip.files).filter(filename => !filename.endsWith('/')).map(filename => {
          return {filename}
        })
        return buildContents(zip, files)
      }
    })
  }

  static listZipFiles(repository:Repository, content:any) {
    var zip = new JSZip();

    return zip.loadAsync(content).then(zip => {
      const result = []
      Object.keys(zip.files).forEach(function(filename) {
        //exclude dirs from zip
        if (!filename.endsWith('/')) {
          const conflict = (repository.getByPathString(filename))?true:false
          result.push({filename, override:true, conflict})
        }
      })
      return result
    })
  }
}

export default ZipHelper