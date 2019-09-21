import React from 'react'
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button as RNButton
} from 'react-native'
import styled from 'styled-components/native'
import {
  Input,
  Button
} from '@corcos/components/native'
import {
  colors
} from '@corcos/lib'

import firebase from '../../lib/firebase'
import NavigationService from '../../lib/NavigationService'

const styles = StyleSheet.create({
  title: {
    marginTop: 15,
    color: colors.grey[800],
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 32
  },
  subtitle: {
    color: colors.grey[800],
    fontSize: 16,
    marginBottom: 60
  },
  terms: {
    // paddingLeft: 30,
    // paddingRight: 30
    paddingBottom: 20
  },
  termsText: {
    fontSize: 14,
    color: colors.grey[800]
  }
})

const Terms = () => (
  <View style={styles.terms}>
    <Text style={styles.termsText}>By using our product and services, you acknowledge that you’ve reviewed and agree to our Terms of Use and Privacy Policy.</Text>
  </View>
)

const ModalContent = (self, store) => {
  if (store.currentUser.uid) {
    return (
      <View>
        <Text>You are signed in!</Text>
        <Text>{store.currentUser.email}</Text>
        <Text>{store.currentUser.phoneNumber}</Text>
        <Button title='Sign out?' onPress={() => store.signOut()} />
      </View>
    )
  }
  if (store.authModalType === 'verify') {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Verify</Text>
        <View style={{ marginBottom: 60 }} />
        <Input onChangeText={t => self.setState({ phoneVerification: t })} />
        <RNButton title='Didn&apos;t receive a code? Send again.' />
        <View style={{ flex: 1 }} />
        <Button title='Verify Phone' onPress={() => self.handleSignUp(store)} />
        <View style={{ height: 30 }} />
      </View>
    )
  }
  if (store.authModalType === 'verify-login') {
    return (
      <View>
        <Text style={{ fontSize: 30, marginBottom: 10 }}>Verify</Text>
        <Input onChangeText={t => self.setState({ phoneVerification: t })} />
        <Text>Didn't receive a code? Send again.</Text>
        <Button title='Verify Phone' onPress={() => self.handleSignIn(store)} />
      </View>
    )
  }
  if (store.authModalType === 'logIn') {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Log in</Text>
        <View style={{ marginBottom: 60 }} />
        <Input placeholder='Phone' value={self.state.phoneNumber} onChangeText={t => self.setState({ phoneNumber: t })} />
        <RNButton title='Don&apos;t have an account? Create one' onPress={() => store.toggleAuthModal('signUp')} />
        <View style={{ flex: 1 }} />
        <Button title='submit' onPress={() => {
          firebase.functions().httpsCallable('verifyPhone')({
            phoneNumber: self.state.phoneNumber
          })
          store.toggleAuthModal('verify-login')
        }} />
        <View style={{ height: 30 }} />
      </View>
    )
  }
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Join today to make a difference.</Text>
      <Input placeholder='Full Name' value={self.state.fullName} onChangeText={t => self.setState({ fullName: t })} />
      <View style={{ height: 15 }} />
      <Input placeholder='Phone' value={self.state.phoneNumber} onChangeText={t => self.setState({ phoneNumber: t })} />
      <RNButton title='Already have an account? Log in' onPress={() => store.toggleAuthModal('logIn')} />
      <View style={{ flex: 1 }} />
      <Terms />
      <Button title='Submit' onPress={() => {
        firebase.functions().httpsCallable('verifyPhone')({
          phoneNumber: self.state.phoneNumber
        })
        store.toggleAuthModal('verify')
      }} />
      <View style={{ height: 30 }} />
    </View>
  )
}

const Container = styled.View`
  flex-direction: column;
  padding-top: 80px;
  flex: 1;
  padding-left: 30px;
  padding-right: 30px;
`

const CloseContainer = styled.View`
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
`

/**
 * Shows the auth modal that allows the user to sign in, create an account, and reset password
 *
 * NOTE: This should really only be used for prototyping to get things out the door faster. For
 * production, you should build your own implementation.
 *
 * @param {string} props.type - determines the first page to display: 'signup' 'signin' 'verify'
 * @param {boolean} props.authModalType - determines whether or not the auth modal is visible - from store
 */
class AuthModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      phoneVerification: '',
      fullName: '',
      phoneNumber: '',
      error: false,
      type: props.type,
      loading: false
    }
  }

  handleSignIn = async (store) => {
    this.setState({ loading: true })
    // if there is a handleSignIn override
    if (this.props.handleSignIn) {
      this.props.handleSignIn(this)
    } else {
      const { phoneNumber, phoneVerification, fullName } = this.state
      try {
        const { data: { token } } = await this.props.firebase.functions().httpsCallable('logInWithPhoneNumber')({
          phoneNumber,
          phoneVerification,
          fullName
        })
        await this.props.firebase.auth().signInWithCustomToken(token)
        await this.setState({
          phoneNumber: '',
          phoneVerification: '',
          fullName: ''
        })
        store.toggleAuthModal(null)
      } catch (err) {
        this.setState({ loading: false })
        this.setState({ error: err.message })
        return null
      }
    }
    this.setState({ loading: false })
  }

  handleSignUp = async (store) => {
    this.setState({ loading: true })
    if (this.props.handleSignUp) {
      this.props.handleSignUp(this)
    } else {
      const { phoneNumber, phoneVerification, fullName } = this.state
      try {
        const { data: { token } } = await this.props.firebase.functions().httpsCallable('createAccount')({
          phoneNumber,
          phoneVerification,
          fullName
        })

        await this.props.firebase.auth().signInWithCustomToken(token)
        await this.setState({
          phoneNumber: '',
          phoneVerification: '',
          fullName: ''
        })
        // route to onboarding and close modal
        store.toggleAuthModal(null)
        await NavigationService.navigate('Onboarding')
      } catch (err) {
        this.setState({ loading: false })
        this.setState({ error: err.message })
        return null
      }
    }
    this.setState({ loading: false })
  }

  handleReset = async () => {
    this.setState({ loading: true })
    if (this.props.handleReset) {
      this.props.handleReset(this)
    } else {
      try {
        await this.props.firebase.auth().sendPasswordResetEmail(this.state.email)
        this.setState({ resetEmailSent: true })
      } catch (err) {
        this.setState({ loading: false })
        this.setState({ error: err.message })
        return null
      }
    }
    this.setState({ loading: false })
  }

  render () {
    const { Consumer } = this.props.context

    return (
      <Consumer>
        {store => (
          <Modal
            onRequestClose={this.props.onRequestClose}
            onShow={this.props.onShow}
            onDismiss={this.props.onDismiss}
            animationType='slide'
            visible={!!store.authModalType}>
            <Container>
              {!this.state.loading
                ? (
                  <>
                    {this.state.error.length > 0 && <Text style={{ color: 'red' }}>{this.state.error}</Text>}
                    {ModalContent(this, store)}
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 50, left: 15, zIndex: 1000 }}
                      onPress={() => store.toggleAuthModal(null)}>
                      <CloseContainer>
                        <Image source={require('../../static/back-arrow.png')} resizeMode='contain' style={{ height: 20 }} />
                      </CloseContainer>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View>
                    <Text>Loading...</Text>
                  </View>
                )}
            </Container>
          </Modal>
        )}
      </Consumer>
    )
  }
}

AuthModal.defaultProps = {
  type: 'signup'
}

export default AuthModal
