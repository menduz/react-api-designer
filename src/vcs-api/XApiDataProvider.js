//@flow

export type XApiDataProvider = {
  baseUrl: () => string,
  projectId: () => string,
  projectName: () => string,
  ownerId: () => string,
  organizationId: () => string,
  authorization: () => string
}

const baseUrl = localStorage.getItem('baseUrl') || 'http://localhost:5000'
const projectId = localStorage.getItem('projectId') || 'f69c9a09-0a17-44fe-860a-b076a44c31b8'
const ownerId = localStorage.getItem('ownerId') || 'd365610a-8e56-42da-a3fc-73b548371cc6'
const organizationId = localStorage.getItem('organizationId') || 'b13cbf39-787d-4d1f-9c72-22275ecc0d59'
const authorization = localStorage.getItem('authorization') || ''

export const localStorageDataProvider: XApiDataProvider = {
  baseUrl: () => {
    return baseUrl
  },
  projectId: () => {
    return projectId
  },
  projectName: () => {
    return projectId
  },
  ownerId: () => {
    return ownerId
  },
  organizationId: () => {
    return organizationId
  },
  authorization: () => {
    return authorization
  }
}
