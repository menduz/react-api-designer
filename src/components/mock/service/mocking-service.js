
export default class MockingService {
  constructor(mockingServiceClient) {
    this.mockingServiceClient = mockingServiceClient
  }

  createMock(ramlContent) {
    const that = this
    return this.dereferenceRaml(ramlContent)
      .then(() => {
        return that.mockingServiceClient.createMock({
          raml: ramlContent
        });
      })
  };

  // createMock(file, raml) {
  //   const that = this
  //   return this.dereferenceRaml(raml)
  //     .then(function () {
  //       return that.mockingServiceClient.createMock({
  //         raml: file.contents,
  //         json: raml
  //       });
  //     })
  //     .then(function (mock) {
  //       return that.setMockMeta(file, mock);
  //     })
  //     ;
  // };

  updateMock(mockId, manageKey, raml, json) {
    return this.mockingServiceClient.updateMock({
      raml: raml,
      json: json,
      id: mockId,
      manageKey: manageKey
    })
  };

  deleteMock(mockId, manageKey) {
    return this.mockingServiceClient.deleteMock(mockId, manageKey);
  };

  dereferenceRaml(raml) {
    return Promise.resolve(raml)
    // return this.mockingServiceUtils.dereference(raml)
    //   .catch(function (error) {
    //     console.error('dereferenceRaml failed', error.stack);
    //   })
    //   ;
  }
}