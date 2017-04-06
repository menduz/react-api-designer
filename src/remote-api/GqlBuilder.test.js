//@flow
import GqlBuilder from './GqlBuilder'

it('Prints Iql query', async() => {
  const iql = new GqlBuilder("accessToken")
    .addParameters("prop1, prop2, prop3")
    .withAsset({organizationId: "organizationId", groupId: "groupId"})
    .withQuery()
    .withLatestVersion()
    .build()
  expect(iql).not.toBeNull()
  console.log(iql)
})