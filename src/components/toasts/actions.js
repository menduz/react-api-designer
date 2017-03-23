//@flow

export const ADD_TOAST = `DESIGNER/TOASTS/ADD_TOAST`
export const REMOVE_TOAST = `DESIGNER/TOASTS/REMOVE_TOAST`

const addToast = (msg: string, kind: string) => ({
  type: ADD_TOAST,
  toast: {msg, kind, date: new Date()}
})

export const removeToast = (toastTitle: string) => ({
  type: REMOVE_TOAST,
  toastTitle
})

export const addInfoToasts = (msg: string) =>
  (dispatch) => {
    dispatch(addToast(msg, "info"))

    setTimeout(() => {
      dispatch(removeToast(msg))
    }, 5000)
  }

export const addSuccessToasts = (msg: string) =>
  (dispatch) => {
    dispatch(addToast(msg, "success"))

    setTimeout(() => {
      dispatch(removeToast(msg))
    }, 5000)
  }

export const addErrorToasts = (error: any) =>
  (dispatch) => {
    console.error(error)
    dispatch(addToast(error.message || error, "error"))
  }
