// @flow

export const API_PROJECT = 'raml'
export const FRAGMENT_PROJECT = 'raml_fragment'
export type ProjectType = 'raml' | 'raml_fragment'

export type State = {
  initializing: boolean,
  projectId: string,
  projectType: ProjectType
}

export const toName = (type: ProjectType): string => {
  return type === API_PROJECT ? 'Spec' : type === FRAGMENT_PROJECT ? 'Fragment' : ''
}
