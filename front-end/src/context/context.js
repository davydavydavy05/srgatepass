import React from 'react'

const SrContext = React.createContext()

export const useSrContext = () => React.useContext(SrContext)

export const SrProvider = ({ children, initialState, reducer }) => {
  const [globalState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <SrContext.Provider value={[globalState, dispatch]}>
      {children}
    </SrContext.Provider>
  )
}