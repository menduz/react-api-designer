//@flows

import Repository from '../Repository'
import Element from '../Element'
import {isRamlFile, isApiDefinition} from './utils'


export default (repository:Repository) => {

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
