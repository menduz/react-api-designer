//@flow

import {Path} from '../../../repository'
import type {ProjectType} from '../../../bootstrap/model'
import {API_PROJECT} from '../../../bootstrap/model'

export type FileType = {
  value: string,
  label: string,
  defaultName: string,
  subTypes?: FileType[],
  info?: string,
  link?: string,
}

export type State = {
  fileName: string,
  fileTypeOptions: FileType[],
  fileType?: FileType,
  fragmentType?: FileType,
  showModal: boolean,
  path?: Path
}

const allFileTypes: FileType[] = [
  {value: 'RAML10', label: 'RAML 1.0', defaultName: 'api.raml', subTypes: [
    {value: 'RAML10', label: 'Spec', defaultName: 'api.raml', info:'RAML 1.0 API Spec', link: 'the-root-of-the-document', projectType: API_PROJECT},
    {value: 'TRAIT', label: 'Trait', defaultName: 'trait.raml', info: 'Define a single trait with common characteristics for methods', link: 'resource-types-and-traits'},
    {value: 'RESOURCE-TYPE', label: 'Resource Type', defaultName: 'resourceType.raml', info: 'Define a single resource type with common characteristics for resources', link: 'resource-types-and-traits'},
    {value: 'LIBRARY', label: 'Library', defaultName: 'library.raml', info: 'Define a collection of data type declarations, resource type declarations, trait declarations, and security scheme declarations into modular, externalized, reusable groups', link: 'libraries'},
    {value: 'OVERLAY', label: 'Overlay', defaultName: 'overlay.raml', info: 'Define an overlay that adds or overrides nodes of a RAML API definition while preserving its behavioral, functional aspects', link: 'overlays', projectType: API_PROJECT},
    {value: 'EXTENSION', label: 'Extension', defaultName: 'extension.raml', info: 'Define an extension that adds or modifies nodes of a RAML API definition', link: 'extensions', projectType: API_PROJECT},
    {value: 'DATA-TYPE', label: 'Type', defaultName: 'dataType.raml', info: 'Define a single data type declaration', link: 'raml-data-types'},
    {value: 'DOCUMENTATION-ITEM', label: 'User Documentation', defaultName: 'documentation.raml', info: 'Define a single page documentation item', link: 'user-documentation'},
    {value: 'NAMED-EXAMPLE', label: 'Example', defaultName: 'example.raml', info: 'Define a single example for a given data type', link: 'defining-examples-in-raml'},
    {value: 'ANNOTATION-TYPE-DECLARATION', label: 'Annotation Type', defaultName: 'annotation.raml', info: 'Define a single annotation type declaration that describes additional metadata that can be applied to any RAML node', link: 'annotations'},
    {value: 'SECURITY-SCHEME', label: 'Security Scheme', defaultName: 'securityScheme.raml', info: 'Define a single security scheme that describes the mechanism to secure data access, identify requests, and determine access level and data visibility', link: 'security-schemes'}
  ]},
  {value: 'RAML08', label: 'RAML 0.8', defaultName: 'api.raml', projectType: API_PROJECT},
  {value: 'OTHER', label: 'Other', defaultName: ''}
];

export const fileTypes = (projectType: ProjectType): FileType[] => {
  return allFileTypes
    .filter(t => !t.projectType || t.projectType === projectType)
    .map(t => !t.subTypes ? t : {
      ...t,
      subTypes: t.subTypes.filter(st => !st.projectType || st.projectType === projectType)
    })
}
