//@flow

import type {Dispatch, GetState} from '../../../types'
import {saveAll} from "../../../repository-redux/actions";
import {openModal as openPublishModal} from "../publish-api/PublishApiActions";
import {getFinishAction} from "./UnsavedSelectors";

export const SHOW = 'DESIGNER/UNSAVED/SHOW_DIALOG'
export const HIDE = 'DESIGNER/UNSAVED/HIDE_DIALOG'
export const SAVING = 'DESIGNER/UNSAVED/SAVING'

const finish = () => (dispatch: Dispatch, getState: GetState): Promise<any> => {
  switch (getFinishAction(getState())) {
    case 'publishing':
      dispatch(openPublishModal(false))
      break;
    default:
      console.warn('Unexpected action to perform after saving')
      break;
  }

  dispatch({type: HIDE})
}

export const saveChanges = () =>
  (dispatch: Dispatchs): Promise<any> => {
    dispatch({type: SAVING})
    dispatch(saveAll()).then(() => {
      dispatch(finish())
    })
  }

export const cancelSave = () => (dispatch: Dispatch): Promise<any> => {
  dispatch(finish())
}

const openUnsavedWarningDialog = (finishActionType: string) => ({
  type: SHOW,
  payload: finishActionType
})

export const openUnsavedWarningBeforePublish = () => (dispatch: Dispatch): Promise<any> => {
  dispatch(openUnsavedWarningDialog('publishing'))
}