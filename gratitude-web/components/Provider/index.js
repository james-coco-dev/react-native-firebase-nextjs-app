import React from 'react'

import { firebase } from '../../lib/firebase'
import Context, { initialState } from '../../lib/context'

/**
 * This component is the Context Provider using the new React Context API that
 * gives the app store state
 * https://blog.bitsrc.io/react-context-api-a-replacement-for-redux-6e20790492b3
 */
class Provider extends React.Component {
  state = initialState

  setCurrentUser = (currentUser) => {
    this.setState({ currentUser })
  }

  signOut = async () => {
    await firebase.auth().signOut()
    this.setState({ ...initialState })
  }

  set = (key, value) => {
    this.setState({ [key]: value })
  }

  render () {
    return (
      <Context.Provider
        value={{
          // NOTE any actions defined in this component must be added to the value here as well
          ...this.state,
          setCurrentUser: this.setCurrentUser,
          set: this.set,
          signOut: this.signOut
        }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default Provider
