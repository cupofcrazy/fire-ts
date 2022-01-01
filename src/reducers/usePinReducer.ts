import { useReducer } from 'react'

/** 
*  This reducer provides state and actions for managing:
*  if pins are saved,
*  loading state,
*  and saves pins
*/
export type State = {
  loading: boolean;
  isSaved: boolean;
  isSaving: boolean;
}
export type Action = {
  type: 'CHECK_IF_PIN_SAVED',
  payload: boolean
} | {
  type: 'PIN_SAVED',
  payload: boolean
} | {
  type: 'SAVE_PIN'
} | {
  type: 'UNSAVE_PIN'
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CHECK_IF_PIN_SAVED':
      return {
        ...state,
        isSaved: action.payload

      }
    case 'PIN_SAVED':
      return {
        isSaved: action.payload,
        isSaving: false,
        loading: false
      }
    case 'SAVE_PIN':
      return {
        ...state,
        loading: true,
        isSaving: true
      }
    case 'UNSAVE_PIN':
      return {
        ...state,
        isSaving: false,
        isSaved: false,
        loading: false
      }
    default:
      return state
  }
}
const initialState = {
  loading: false,
  isSaved: false,
  isSaving: false
}

export const usePinReducer = () => useReducer(reducer, initialState)