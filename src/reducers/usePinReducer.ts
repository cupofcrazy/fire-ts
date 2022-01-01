import { useReducer } from 'react'

/** 
*  This reducer provides state and actions for managing:
*  if pins are saved,
*  loading state,
*  and saves pins
*/
type State = {
  loading: boolean;
  isSaved: boolean;
  isSaving: boolean;
}
type Action = {
  type: 'CHECK_IF_PIN_SAVED',
  payload: boolean
} | {
  type: 'PIN_SAVED',
  payload: boolean
} | {
  type: 'SAVE_PIN'
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