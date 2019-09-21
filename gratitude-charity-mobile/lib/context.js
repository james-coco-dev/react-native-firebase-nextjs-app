import React from 'react'

// NOTE this is the initial, state of the app store
export const initialState = {
  currentUser: {},
  authModalType: null // keep auth modal state in store, as it needs to be accessed from many components: null, 'signUp', 'logIn', etc
}

export const Context = React.createContext(initialState)

export default Context
