import {List} from 'immutable'
import {Fragment} from './Fragment'
import ConsumeRemoteApi from '../../../remote-api/ConsumeRemoteApi'
import type {Dispatch, GetState, ExtraArgs} from '../../../types'

export const FRAGMENTS_CHANGED = 'CONSUME_API/FRAGMENTS_CHANGED'
export const OPEN_MODAL = 'CONSUME_API/OPEN_MODAL'
export const CLEAR = 'CONSUME_API/CLEAR'
export const UPDATE_QUERY = 'CONSUME_API/UPDATE_QUERY'
export const IS_SEARCHING = 'CONSUME_API/IS_SEARCHING'
export const IS_SUBMITTING = 'CONSUME_API/IS_SUBMITTING'
export const ERROR = 'CONSUME_API/ERROR'

export const fragmentsChanged = (fragments: List<Fragment>) => ({
  type: FRAGMENTS_CHANGED,
  payload: fragments
})

export const openModal = () => ({
  type: OPEN_MODAL
})

export const clear = () => ({
  type: CLEAR
})

export const updateQuery = (query: string) => ({
  type: UPDATE_QUERY,
  payload: query
})

export const isSearching = (isSearching: boolean) => ({
  type: IS_SEARCHING,
  payload: isSearching
})

export const isSubmitting = (isSubmitting: boolean) => ({
  type: IS_SUBMITTING,
  payload: isSubmitting
})

export const showError = (errorMsg: string) => ({
  type: ERROR,
  payload: errorMsg
})


export const submit = (fragments: List<Fragment>) => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    dispatch(isSubmitting(true)) // in progress

    const selected = fragments.filter(fragment => fragment.selected)
    const dependencies = selected.map( c=> {
      return {groupId:c.groupId, assetId: c.assetId, version: c.version}
      }
    )
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    consumeRemoteApi.addDependencies(dependencies).then(() => {
      dispatch(clear()) // close dialog
    }).catch(err => {
      console.log('Error when added dependencies', selected)
      dispatch(showError('Error when trying to submit')) // show error in dialog
    })
  }
}

export const handleFragmentSelection = (index: number, fragment: Fragment, selected: boolean) => {
  return (dispatch: Dispatch, getState) => {
    const {fragments} : List<Fragment> = getState().consumeApi
    dispatch(fragmentsChanged(fragments.set(index, {...fragment, selected})))
  }
}

export const searchFragments = (query: string) => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    dispatch(isSearching(true))
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    consumeRemoteApi.queryFragments(query).then((fragments) => {
      console.log(fragments)
      dispatch(isSearching(false))
      dispatch(fragmentsChanged(new List(fragments)))
    }).catch((error) => {
      dispatch(isSearching(false))
      dispatch(showError(error.toString()))
    })
  }
}

