import React from 'react'

export const initialState = {
  currentUser: {},
  dream: {}
}

export const Context = React.createContext(initialState)

export default Context
