import React, { createContext, useReducer, useContext, FC } from 'react'
import { useDevice } from 'vtex.device-detector'

interface OpenMinicartAction {
  type: 'OPEN_MINICART'
}
interface CloseMinicartAction {
  type: 'CLOSE_MINICART'
}

interface State {
  variation: MinicartVariationType
  open: boolean
  hasBeenOpened: boolean
  openOnHover: boolean
}

interface Props {
  openOnHover: boolean
  variation: MinicartVariationType
}

type Action = OpenMinicartAction | CloseMinicartAction
type Dispatch = (action: Action) => void

const MinicartStateContext = createContext<State | undefined>(undefined)
const MinicartDispatchContext = createContext<Dispatch | undefined>(undefined)

function minicartContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_MINICART':
      return {
        ...state,
        open: true,
        hasBeenOpened: true,
      }
    case 'CLOSE_MINICART':
      return {
        ...state,
        open: false,
      }
    default:
      return state
  }
}

const MinicartContextProvider: FC<Props> = ({
  variation = 'drawer',
  openOnHover = false,
  children,
}) => {
  const { isMobile } = useDevice()
  const resolvedVariation =
    isMobile || (window && window.innerWidth <= 480) ? 'drawer' : variation

  const [state, dispatch] = useReducer(minicartContextReducer, {
    variation: resolvedVariation,
    open: false,
    hasBeenOpened: false,
    openOnHover: resolvedVariation !== 'popup' ? false : openOnHover,
  })

  return (
    <MinicartStateContext.Provider value={state}>
      <MinicartDispatchContext.Provider value={dispatch}>
        {children}
      </MinicartDispatchContext.Provider>
    </MinicartStateContext.Provider>
  )
}

function useMinicartState() {
  const context = useContext(MinicartStateContext)
  if (context === undefined) {
    throw new Error(
      'useMinicartState must be used within a MinicartContextProvider'
    )
  }
  return context
}

function useMinicartDispatch() {
  const context = useContext(MinicartDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useMinicartDispatch must be used within a MinicartContextProvider'
    )
  }
  return context
}

export { MinicartContextProvider, useMinicartDispatch, useMinicartState }
