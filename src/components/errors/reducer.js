export const GO_TO_ERROR = 'DESIGNER/ERROR/GO_TO_ERROR'

const initialState = {
  errorCursor: {
    column: -1,
    lineNumber: -1
  }
}

export const goToErrorAction = error => ({
  type: GO_TO_ERROR,
  error
})

export const goToErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GO_TO_ERROR:
      return {
        ...state,
        errorCursor: {
          lineNumber: action.error.startLineNumber,
          column: action.error.startColumn
        }
      }
    default:
      return state
  }
}