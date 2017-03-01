//@flow

export type RemoteApiDataProvider = {
  baseUrl: () => string,
  authorization: () => string,
  ownerId: () => string,
  organizationId: () => string,
  projectId: () => string
}
