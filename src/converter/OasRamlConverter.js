//@flow

// import converter from 'oas-raml-converter'
import Repository from '../repository/Repository'
import Element from '../repository/Element'


class OasRamlConverter {

  static convertToSwagger(repository: Repository, format) {

    const toSwagger = {} // new converter.Converter(converter.Formats.AUTO, converter.Formats.SWAGGER)
    const options = {
      format: format,
      fsResolver: {
        content: function content(path) {
          throw new Error('ramlParser: loadPath: loadApi: content: ' + path + ': no such path');
        },
        contentAsync: function contentAsync(path) {
          const p = (path.startsWith('/'))?path.substring(1, path.length): path
          console.log(`contentAsync('${p}') `)
          const file = repository.getByPathString(p);
          if (!file) {
            return Promise.reject('ramlEditorMain: loadRaml: contentAsync: ' + path + ': no such path');
          }
          return file.getContent()
        }
      }
    };
    return OasRamlConverter.findRoot(repository).then(rootPath => { return toSwagger.convertFile(rootPath, options)})
  }

  static findRoot(repository: Repository) {

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

    function findRaml(elem:Element):Promise<> {
      console.log(elem.name)
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


}

export default OasRamlConverter