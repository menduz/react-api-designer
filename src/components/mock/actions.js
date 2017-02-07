import MockingService from './service/mocking-service'
import MockingServiceClient from './service/mocking-service-client'
import {updateCurrentFile} from '../../components/editor/actions'
import {getCurrentFileContent} from '../../repository-redux/selectors'

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
    const ramlContent = getCurrentFileContent(getState())()
    //@@TODO GET editor.parsedObject from a function!!
    const jsonObject = getState().editor.parsedObject

    mock.createMock(ramlContent, jsonObject).then(res => {
      dispatch(mockStarted(res.id, res.manageKey, res.baseUri, res.manageUri))
      addMockBaseUri(ramlContent, res.baseUri)(dispatch, getState)
    }).catch(err => {
      console.log(err)
      dispatch(stopMock)
    })

  }
}

export const updateMock = (getState) => {
  const state = getState().mock;
  if (state.isUp) {
    const mock = new MockingService(new MockingServiceClient())
    const ramlContent = getCurrentFileContent(getState())()
    //@@TODO GET editor.parsedObject from a function!!
    const jsonObject = getState().editor.parsedObject
    mock.updateMock(state.id,state.manageKey, ramlContent, jsonObject)
  }
}

const addMockBaseUri = (ramlContent, baseUri) => (dispatch) => {
  const newContent = ramlContent.split('\n').map(line => {
    if (line.trim().startsWith('baseUri')) {
      return 'baseUri: ' + baseUri + " # " + line
    } else return line
  }).join('\n')
  dispatch(updateCurrentFile(newContent))
}

const removeMockBaseUri = (ramlContent, baseUri) => (dispatch) => {
  const newContent = ramlContent.split('\n').map(line => {
    if (line.trim().startsWith('baseUri')) {
      return line.replace('baseUri: ' + baseUri + ' # ', '')
    } else return line
  }).join('\n')
  dispatch(updateCurrentFile(newContent))
}

export const deleteMock = ()  => (dispatch, getState) => {
  if (getState().mock.isUp && !getState().mock.isStopping) {
    const baseUri = getState().mock.baseUri
    dispatch(beginStopMock)
    const mock = new MockingService(new MockingServiceClient())
    mock.deleteMock(getState().mock.id, getState().mock.manageKey).then(() => {
      dispatch(stopMock)
      const ramlContent = getCurrentFileContent(getState())()
      removeMockBaseUri(ramlContent, baseUri)(dispatch)
    }).catch(err => {
      console.log(err)
      dispatch(stopMock)
    })
  }
}
