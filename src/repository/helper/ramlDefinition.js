//@flows

import Repository from '../Repository'
import Element from '../Element'


export default (repository:Repository) => {

  function getFirstLine(raml) {
    return raml.split(/\r\n|\n/)[0];
  }

  function isRamlFile(name) {
    return name.endsWith('.raml');
  }

  function isApiDefinition(raml) {
    return /^#%RAML\s(0\.8|1\.0)\s*$/.test(getFirstLine(raml));
  }

  const ramls = []

  function findRaml(elem:Element) {
    if (!elem.isDirectory()) {
      if (isRamlFile(elem.name)) {
        return elem.getContent().then(c => {
          if (isApiDefinition(c)) ramls.push(elem.path)
        })
      } else {
        return Promise.resolve()
      }
    } else {
      return Promise.all(elem.children.map(c => {
        return findRaml(c)
      }))
    }
  }

  return findRaml(repository.root).then(()=> {
    if(ramls.length === 0) throw Error('Cannot find raml file')
    else {
      const path = ramls[0].toString();
      return path.startsWith('/')?path.substring(1,path.length):path
    }
  })
}
