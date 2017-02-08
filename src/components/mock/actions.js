//@flow

import MockingService from './service/mocking-service'
import MockingServiceClient from './service/mocking-service-client'
import {updateCurrentFile} from '../../components/editor/actions'
import {getCurrentFileContent} from '../../repository-redux/selectors'
import {getCurrentFilePath} from '../editor/selectors'

export const START_MOCK = 'DESIGNER/MOCK/START_MOCK'
export const MOCK_STARTED = 'DESIGNER/MOCK/MOCK_STARTED'
export const STOP_MOCK = 'DESIGNER/MOCK/STOP_MOCK'
export const BEGIN_STOP_MOCK = 'DESIGNER/MOCK/BEGIN_STOP_MOCK'



const startMock = (file:string) => ({
  type: START_MOCK,
  file
})

const stopMock = (file:string) => ({
  type: STOP_MOCK,
  file
})

const beginStopMock = (file:string) => ({
  type: BEGIN_STOP_MOCK,
  file
})

const mockStarted = (file, id, manageKey, baseUri, manageUri) => ({
  type: MOCK_STARTED,
  file,
  id,
  manageKey,
  baseUri,
  manageUri
})


export const createMock = () => (dispatch, getState) => {
  const file = getCurrentFilePath(getState()).toString()
  const state = getState().mock
  const m = state.find(c => c.file === file)
  if (!m || (!m.isUp && !m.isStarting)) {
    dispatch(startMock(file))
    const mock = new MockingService(new MockingServiceClient())
    const ramlContent = getCurrentFileContent(getState())()
    //@@TODO GET editor.parsedObject from a function!!
    const jsonObject = getState().editor.parsedObject

    mock.createMock(ramlContent, jsonObject).then(res => {
      dispatch(mockStarted(file, res.id, res.manageKey, res.baseUri, res.manageUri))
      addMockBaseUri(ramlContent, res.baseUri)(dispatch, getState)
    }).catch(err => {
      console.error(err)
      dispatch(stopMock)
    })

  }
}

export const updateMock = () => (dispatch, getState) => {
  const file = getCurrentFilePath(getState()).toString()
  const state = getState().mock;
  const m = state.find(c => c.file === file)
  if (m && m.isUp) {
    const mock = new MockingService(new MockingServiceClient())
    const ramlContent = getCurrentFileContent(getState())()
    //@@TODO GET editor.parsedObject from a function!!
    const jsonObject = getState().editor.parsedObject
    mock.updateMock(m.id,m.manageKey, ramlContent, jsonObject)
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
  const file = getCurrentFilePath(getState()).toString()
  const state = getState().mock;
  const m = state.find(c => c.file === file)

  if (m !== undefined && m.isUp && !m.isStopping) {
    const baseUri = m.baseUri
    dispatch(beginStopMock(file))
    const mock = new MockingService(new MockingServiceClient())
    mock.deleteMock(m.id, m.manageKey).then(() => {
      dispatch(stopMock(file))
      const ramlContent = getCurrentFileContent(getState())()
      removeMockBaseUri(ramlContent, baseUri)(dispatch)
    }).catch(err => {
      console.error(err)
      dispatch(stopMock(file))
    })
  }
}
