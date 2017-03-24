// @flow

import {List} from 'immutable'
import {Fragment} from './Fragment'
import ConsumeRemoteApi from '../../../remote-api/ConsumeRemoteApi'
import type {Dispatch, GetState, ExtraArgs} from '../../../types'
import {getFragments, getQuery} from "./selectors";
import {addExchangeDependency} from '../../../repository-redux/actions'

export const FRAGMENTS_CHANGED = 'DESIGNER/CONSUME_API/FRAGMENTS_CHANGED'
export const ADD_FRAGMENTS = 'DESIGNER/CONSUME_API/ADD_FRAGMENTS'
export const OPEN_MODAL = 'DESIGNER/CONSUME_API/OPEN_MODAL'
export const CLEAR = 'DESIGNER/CONSUME_API/CLEAR'
export const UPDATE_QUERY = 'DESIGNER/CONSUME_API/UPDATE_QUERY'
export const IS_SEARCHING = 'DESIGNER/CONSUME_API/IS_SEARCHING'
export const IS_SUBMITTING = 'DESIGNER/CONSUME_API/IS_SUBMITTING'
export const ERROR = 'DESIGNER/CONSUME_API/ERROR'
export const IS_ADDING_MORE = 'DESIGNER/CONSUME_API/IS_ADDING_MORE'
export const NO_MORE_FRAGMENTS = 'DESIGNER/CONSUME_API/NO_MORE_FRAGMENTS'

export const fragmentsChanged = (fragments: List<Fragment>) => ({
  type: FRAGMENTS_CHANGED,
  payload: fragments
})

export const noMoreFragments = () => ({
  type: NO_MORE_FRAGMENTS
})

export const addFragments = (fragments: List<Fragment>) => ({
  type: ADD_FRAGMENTS,
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

export const isSearching = () => ({
  type: IS_SEARCHING
})

export const isSubmitting = () => ({
  type: IS_SUBMITTING
})

export const showError = (errorMsg: string) => ({
  type: ERROR,
  payload: errorMsg
})

export const isAddingMore = () => ({
  type: IS_ADDING_MORE
})

export const submit = (fragments: List<Fragment>) => {
  return (dispatch: Dispatch) => {
    dispatch(isSubmitting()) // in progress

    const selected = fragments.filter(fragment => fragment.selected)
    const dependencies = selected.map(c => {
        return {groupId: c.groupId, assetId: c.assetId, version: c.version}
      }
    )

    dispatch(addExchangeDependency(dependencies)).then(() => {
      dispatch(clear()) // close dialog
    }).catch(err => {
      console.log('Error when adding dependencies', selected, err)
      dispatch(showError(`${err.message || err || 'Error when adding dependency'}`)) // show error in dialog
    })
  }
}

export const handleFragmentSelection = (index: number, fragment: Fragment, selected: boolean) => {
  return (dispatch: Dispatch, getState: GetState) => {
    const fragments: List<Fragment> = getFragments(getState())
    dispatch(fragmentsChanged(fragments.set(index, {...fragment, selected})))
  }
}

export const searchFragments = (query: string) => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    dispatch(isSearching())
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    consumeRemoteApi.queryFragments(query).then((fragments) => {
      dispatch(fragmentsChanged(new List(fragments)))
    }).catch((error) => {
      console.log(error)
      dispatch(showError(error.message || error.toString()))
    })
  }
}

export const openAndPopulate = () => {
  return (dispatch: Dispatch) => {
    dispatch(openModal())
    dispatch(searchFragments(''))
  }
}

export const searchMoreFragments = () => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    const query = getQuery(getState())
    const fragments = getFragments(getState())
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))

    dispatch(isAddingMore())
    consumeRemoteApi.queryFragments(query, fragments.count()).then((fragments) => {
      if (fragments.length !== 0)
        dispatch(addFragments(new List(fragments)))
      else
        dispatch(noMoreFragments())
    }).catch((error) => {
      console.log(error)
      dispatch(showError(error.message || error.toString()))
    })
  }
}

