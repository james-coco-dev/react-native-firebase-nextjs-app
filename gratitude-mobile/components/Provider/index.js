import React from 'react'

/**
 * This component is the Context Provider using the new React Context API that
 * gives the app store
 * https://blog.bitsrc.io/react-context-api-a-replacement-for-redux-6e20790492b3
 *
 * @param {Object} props.initialState - initial state of the app
 * @param {Object} props.firebase
 * @param {Object} props.context
 */
class Provider extends React.Component {
  constructor (props) {
    super(props)
    this.state = props.initialState

    if (!props.firebase) {
      throw new Error('Component `Provider` requires `firebase` as prop.')
    }
    if (!props.initialState) {
      throw new Error('Component `Provider` requires `initialState` as prop.')
    }
    if (!props.context) {
      throw new Error('Component `Provider` requires `context` as prop.')
    }
  }

  static defaultProps = {
    value: {}
  }

  // signout needs to be handled at the top-level because we need to reset the cache
  // or firebase doesnt know whether or not the user is signed out or is checking
  signOut = () => {
    this.props.firebase.auth().signOut()
    this.setState({ ...this.props.initialState })
  }

  setCurrentUser = (currentUser) => {
    this.setState({ currentUser })
  }

  toggleAuthModal = (state) => {
    // set the auth modal state to either the value or just whatever it is not now
    this.setState({ authModalType: state })
  }

  togglePlaidModal = () => {
    this.setState({ plaidModalIsOpen: !this.state.plaidModalIsOpen })
  }

  setBankData = (data) => {
    this.setState({ bankData: data })
  }

  render () {
    const { Provider } = this.props.context

    const value = {
      // NOTE any actions defined in this component must be added to the value here as well
      ...this.state,
      setCurrentUser: this.setCurrentUser,
      signOut: this.signOut,
      toggleAuthModal: this.toggleAuthModal,
      setBankData: this.setBankData,
      togglePlaidModal: this.togglePlaidModal
    }

    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    )
  }
}

export default Provider
