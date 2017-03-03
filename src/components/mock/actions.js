import MockingService from './service/mocking-service'
import MockingServiceClient from './service/mocking-service-client'
import {updateCurrentFile} from '../../components/editor/actions'
import {getCurrentFileContent} from '../../repository-redux/selectors'
import {getCurrentFilePath} from '../editor/selectors'
import {addErrorToasts} from '../toasts/actions'

export const START_MOCK = 'DESIGNER/MOCK/START_MOCK'
export const MOCK_STARTED = 'DESIGNER/MOCK/MOCK_STARTED'
export const STOP_MOCK = 'DESIGNER/MOCK/STOP_MOCK'
export const BEGIN_STOP_MOCK = 'DESIGNER/MOCK/BEGIN_STOP_MOCK'

const startMock = (file: string) => ({
  type: START_MOCK,
  file
})

const stopMock = (file: string) => ({
  type: STOP_MOCK,
  file
})

const beginStopMock = (file: string) => ({
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

const baseMockUri = (baseUri, line) => {
  return 'baseUri: ' + baseUri + " # " + line
}

const addMockBaseUri = (ramlContent, baseUri) => (dispatch) => {
  let addNewline = true

  let newContent = ramlContent.split('\n').map(line => {
    if (line.trim().startsWith('baseUri')) {
      addNewline = false
      return baseMockUri(baseUri, line)
    } else return line
  }).join('\n')

  if (addNewline) {
    newContent = ramlContent.slice(0, ramlContent.indexOf('\n') + 1) + baseMockUri(baseUri, '\n') +
      ramlContent.slice(ramlContent.indexOf('\n') + 1, ramlContent.length)
  }

  dispatch(updateCurrentFile(newContent))
}

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
      dispatch(stopMock(file))
      dispatch(addErrorToasts(err.message || err))
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
    mock.updateMock(m.id, m.manageKey, ramlContent, jsonObject)
  }
}

const removeMockBaseUri = (ramlContent, baseUri) => (dispatch) => {

  const mockUri = baseMockUri(baseUri, '');

  let removeLine = false
  let newContent = ramlContent.split('\n').map(line => {
    if (line.trim().startsWith('baseUri')) {
      if (line.trim() === mockUri.trim()) removeLine = true
      return line.replace(mockUri, '')
    } else return line
  }).join('\n')

  if (removeLine) {
    const value = mockUri + '\n';
    const idx = ramlContent.indexOf(value);
    newContent = ramlContent.slice(0, idx) + ramlContent.slice(idx + value.length, ramlContent.length)
  }

  dispatch(updateCurrentFile(newContent))
}

export const deleteMock = () => (dispatch, getState) => {
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
      dispatch(addErrorToasts(err.message || err))
    })
  }
}