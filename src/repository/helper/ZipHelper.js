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

  static saveFiles(repository:Repository, content:any, files:Array) {
    var zip = new JSZip();
    console.log("files!" + files.length)

    return zip.loadAsync(content).then(zip => {
      console.log("Load zip!")
      const result = []
      files.map(f => {
        console.log("files zip!" + f.filename)
        zip.files[f.filename].async('string').then(c => {
          console.log({filename: f.filename, content:c})
        })
      })
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
        // var content = zip.files[filename].asNodeBuffer();
        // var dest = path.join(unzip, filename);
        // fs.writeFileSync(dest, content);
      })
      return result
    })
  }
}

export default ZipHelper