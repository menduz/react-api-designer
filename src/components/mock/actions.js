import MockingService from './service/mocking-service'
import MockingServiceClient from './service/mocking-service-client'


export const START_MOCK = 'DESIGNER/MOCK/START_MOCK'
export const MOCK_STARTED = 'DESIGNER/MOCK/MOCK_STARTED'
export const STOP_MOCK = 'DESIGNER/MOCK/STOP_MOCK'
export const BEGIN_STOP_MOCK = 'DESIGNER/MOCK/BEGIN_STOP_MOCK'



const startMock = ({
    type: START_MOCK
})

const stopMock = ({
    type: STOP_MOCK
})

const beginStopMock = ({
  type: BEGIN_STOP_MOCK
})

const mockStarted = (id, manageKey, baseUri, manageUri) => ({
  type: MOCK_STARTED,
  id,
  manageKey,
  baseUri,
  manageUri
})


export const createMock = () => (dispatch, getState) => {
  if (!getState().mock.isUp && !getState().mock.isStarting) {
    dispatch(startMock)
    const mock = new MockingService(new MockingServiceClient())
    //@@TODO GET editor.text from a function!!
    const ramlContent = getState().editor.text;
    const jsonObject = getState().editor.parsedObject;

    mock.createMock(ramlContent, jsonObject).then(res => {
      dispatch(mockStarted(res.id, res.manageKey, res.baseUri, res.manageUri))
    }).catch(err => {
      console.log(err)
      dispatch(stopMock)
    })

  }
}

export const deleteMock = ()  => (dispatch, getState) => {
  if (getState().mock.isUp && !getState().mock.isStopping) {
    dispatch(beginStopMock)
    const mock = new MockingService(new MockingServiceClient())
    mock.deleteMock(getState().mock.id, getState().mock.manageKey).then(() => {
      dispatch(stopMock)
    }).catch(err => {
      console.log(err)
      dispatch(stopMock)
    })
  }
}
