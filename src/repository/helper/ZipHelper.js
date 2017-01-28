// @flow
import Directory from '../Directory'
import Element from '../Element'

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

}

export default ZipHelper