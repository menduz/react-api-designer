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

const line = (text: string, line: number = 1, limit: integer = 50): string => {
  const l = text.substring(0, limit).split(/\r\n|\n/, line) // stop at first /n
  if (!l) return text
  const item = l[line - 1]
  return item ? item.trim() : text
}

const oasType = (text: string): boolean => {
  return text.substring(0, 100).indexOf('swagger') > -1
}

const ramlType = (text: string): string => {
  const first = line(text, 1)
  if (first === '#%RAML 0.8') return '0.8'
  if (!first.startsWith('#%RAML 1.0')) return ''
  const subType = first.substring('#%RAML 1.0'.length).trim()
  return subType || '1.0'
}

export const MD: Language = {id: 'md', native: true, label: 'Markdown'}
export const JSON: Language = {id: 'json', native: true, label: 'JSON'}
export const YAML: Language = {id: 'yaml', native: true, label: 'YAML'}
export const OAS: Language = {id: 'oas', parent: 'json', label: 'OAS', type: '1.0'}

export const language = (path: string, text: string): Language => {
  const extension = pathExtension(path, 'txt')

  switch (extension) {
    case 'raml':
      const type = ramlType(text);
      return type ? {id: 'raml', type} : YAML
    case 'json':
      return oasType(text) ? OAS : JSON
    case 'yml':
    case 'yaml':
      return oasType(text) ? OAS : YAML
    case 'md':
    case 'markdown':
      return MD
    default:
      return {id: extension, native: true}
  }
}

export const isRamlFile = (name): string =>  {
  return name.endsWith('.raml');
}

export const isApiDefinition = (raml): string => {
  return /^#%RAML\s(0\.8|1\.0)\s*$/.test(line(raml));
}
