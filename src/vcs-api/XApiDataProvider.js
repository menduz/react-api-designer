//@flow

export type XApiDataProvider = {
  baseUrl: () => string,
  projectId: () => string,
  projectName: () => string,
  ownerId: () => string,
  organizationId: () => string,
  authorization: () => string
}
