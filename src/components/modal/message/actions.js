// @flow

import * as React from 'react'

export const OPEN_MODAL = 'DESIGNER/MESSAGE_MODAL/OPEN_MODAL'
export const CLEAR = 'DESIGNER/MESSAGE_MODAL/CLEAR'
export const SET_CONTENT = 'DESIGNER/MESSAGE_MODAL/SET_CONTENT'

export const openModal = () => ({
  type: OPEN_MODAL
})

export const clear = () => ({
  type: CLEAR
})

export const setContent = (content: {title: string, message: string | {}}) => ({
  type: SET_CONTENT,
  payload: content
})
