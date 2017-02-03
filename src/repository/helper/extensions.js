//@flow

export const pathExtension = (path: string, defaultValue: string = ''): string => {
  const lastSlush = path.lastIndexOf('/')
  const name = lastSlush > -1 ? path.substring(lastSlush + 1) : path

  const lastDot = name.lastIndexOf('.')
  return lastDot > -1 ? name.substring(lastDot + 1) : defaultValue
}

type Language = {
  id: string,
  native: boolean,
  parent:? string,
  type:? string
}

const line = (text: string, line: number = 1): string => {
  const l = text.split('\n', line) // stop at first /n
  if (!l) return text
  const item = l[line - 1];
  return item ? item.trim() : text
}

const ramlType = (text: string): string => {
  const first = line(text, 1)
  if (first === '#%RAML 0.8') return '0.8'
  if (!first.startsWith('#%RAML 1.0')) return ''
  const subType = first.substring('#%RAML 1.0'.length).trim()
  return subType || '1.0'
}

const JSON: Language = {id: 'json', native: true}
const YAML: Language = {id: 'yaml', native: true}
const OAS: Language = {id: 'oas', parent: 'json'}

export const language = (path: string, text: string): Language => {
  const extension = pathExtension(path, 'txt')

  switch (extension) {
    case 'raml':
      const type = ramlType(text);
      return type ? {id: 'raml', type} : YAML
    case 'json':
      return line(text, 2).indexOf('swagger') > -1 ? OAS : JSON
    case 'yml':
    case 'yaml':
      return line(text, 1).indexOf('swagger') > -1  ? OAS : YAML
    default:
      return {id: extension, native: true}
  }
}