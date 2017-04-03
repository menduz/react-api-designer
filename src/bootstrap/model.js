// @flow

export const API_PROJECT = 'raml'
export const FRAGMENT_PROJECT = 'raml_fragment'
export type ProjectType = 'raml' | 'raml_fragment'

export type State = {
  initializing: boolean,
  projectId: string,
  projectType: ProjectType
}