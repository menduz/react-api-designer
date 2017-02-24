import ExchangeApi from './ExchangeApi'
import type {XApiDataProvider} from 'XApiDataProvider'

class ProjectRemoteApi extends ExchangeApi {

  constructor(data: XApiDataProvider) {
    super(data)
  }

  createProject(project: ProjectDefinition): Promise<CreateProjectResponse> {
    return this._post(['projects'], project)
  }

  openProject(projectId: string): Promise {
    return this._get(['projects', projectId, 'open'])
  }

  deleteProject(projectId: string): Promise {
    return this._delete(['projects', projectId])
  }

  editProject(projectId: string, project: ProjectDefinition): Promise {
    return this._put(['projects', projectId], project)
  }

  getProject(projectId: string): Promise<ProjectResponse> {
    return this._get(['projects', projectId])
  }

  listProjects(): Promise<ProjectResponse[]> {
    return this._get(['projects'])
  }
}

export type ProjectDefinition = {
  name: string,
  description: string,
  type: string
}

export type CreateProjectResponse = {
  id: string,
  storageId: string,
  version: number,
  organizationId: string,
  name: string,
  description: string,
  type: string,
  vcsType: string,
  externalUri: string,
  externalUriSchema: string,
  createdBy: string,
  createdDate: number,
  initialWorkingDirectory: {
    id: string,
    projectId: string,
    branch: string,
    ownerId: string,
    ownerUsername: string,
    ownerEmail: string,
    externalUri: string,
    externalUriSchema: string,
    vcsType: string,
    createdDate: number
  }
}

export type ProjectResponse = {
  id: string,
  storageId: string,
  version: number,
  organizationId: string,
  name: string,
  type: string,
  vcsType: string,
  externalUri: string,
  externalUriSchema: string,
  createdBy: string,
  createdDate: number
}

export default ProjectRemoteApi