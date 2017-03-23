// @flow

export const API_PROJECT = 'raml'
export const FRAGMENT_PROJECT = 'raml_fragment'
export type ProjectType = | API_PROJECT | FRAGMENT_PROJECT

export const API_PROJECT_NAME = 'ApiDesign'
export const FRAGMENT_PROJECT_NAME = 'ApiFragment'
export type ProjectTypeName = | API_PROJECT_NAME | FRAGMENT_PROJECT_NAME


export const toProjectType = (projectTypeName: string): ProjectType => {
  switch (projectTypeName) {
    case FRAGMENT_PROJECT_NAME:
      return FRAGMENT_PROJECT
    case API_PROJECT_NAME:
    default:
      return API_PROJECT
  }
}

export type State = {
  initializing: boolean,
  projectId: string,
  projectType: ProjectType
}