import React from 'react'
import { colors, getFileAsBinary, uploadImage } from '@corcos/lib'
import { Data, Loading } from '@corcos/components'
import { withRouter } from 'next/router'
import Dropzone from 'react-dropzone'
import PlaidLink from 'react-plaid-link'

import {
  Head,
  Navbar,
  Button,
  Input,
  Format,
  Footer,
  Textarea,
  Search,
  Layout
} from '../../components'

import Context from '../../lib/context'
import { db, firebase } from '../../lib/firebase'
import { async } from '@firebase/util'
const {
  PLAID_PUBLIC_KEY,
  PLAID_PUBLIC_KEY_TEST,
  PLAID_DEV_ENV,
  PLAID_PROD_ENV
} = require('../../lib/credential')

class GeneralInformation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: '',
      fullName: props.user.fullName || '',
      aboutMe: props.user.aboutMe || '',
      avatarUrl: props.user.avatarUrl || '',
      location: props.user.location || '',
      phoneNumber: props.user.phoneNumber || '',
      email: props.user.email || '',
      validation: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.userAccount.settings')
  }

  static contextType = Context;

  onDrop = async (acceptedFiles, rejectedFiles) => {
    let file
    try {
      file = await getFileAsBinary(acceptedFiles[0])
    } catch (err) {
      console.error(err)
    }

    let url
    try {
      url = await uploadImage({
        contentType: acceptedFiles[0].type,
        firebase,
        path: `/user-avatar/${this.context.currentUser.uid}?${Date.now()}`,
        file
      })
    } catch (err) {
      console.error(err)
    }

    await this.setState({ image: url })
  };

  handleSubmit = async () => {
    const {
      fullName,
      aboutMe,
      image,
      avatarUrl,
      location,
      phoneNumber,
      email
    } = this.state
    if (!/@/g.test(email)) {
      this.setState({ validation: true })
      return null
    }
    if (!fullName) {
      this.setState({ validation: true })
      return null
    }

    this.setState({ validation: false })
    try {
      await db
        .collection('users')
        .doc(this.props.store.currentUser.uid)
        .set(
          {
            fullName,
            aboutMe,
            avatarUrl: image || avatarUrl,
            location,
            phoneNumber,
            email
          },
          { merge: true }
        )
      window.alert('updated!')
    } catch (err) {
      console.error(err)
    }
  };

  render () {
    return (
      <div className='contain'>
        <h1 className='title'>Your Profile</h1>
        <div className='label'>PHOTO</div>
        <div className='photo-row'>
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => {
              const inputProps = getInputProps()
              const rootProps = getRootProps()
              return (
                <div
                  {...rootProps}
                  className={`dropzone ${isDragActive ? 'active' : ''}`}
                >
                  {this.state.image !== '' ? (
                    <img className='avatar' src={this.state.image} />
                  ) : this.props.user.avatarUrl === undefined ? (
                    <img src={this.state.image} />
                  ) : (
                    <img
                      className='avatar'
                      src={
                        this.props.user.avatarUrl ||
                        '/static/user-placeholder.png'
                      }
                    />
                  )}

                  <input {...inputProps} />
                  {this.state.image === '' &&
                  this.props.user.avatarUrl === undefined
                    ? '+'
                    : null}
                </div>
              )
            }}
          </Dropzone>
          <div className='photo-text'>
            {this.props.user.avatarUrl === ''
              ? 'Upload a photo'
              : 'Change Photo'}
          </div>
        </div>
        <div className='label'>NAME</div>
        <Input
          value={this.state.fullName}
          onChange={v => this.setState({ fullName: v })}
          validation={this.state.validation}
          validationText='You must enter your name.'
        />
        <div className='label'>EMAIL</div>
        <Input
          type='email'
          value={this.state.email}
          onChange={v => this.setState({ email: v })}
          validation={this.state.validation}
          validationText='Invalid email address'
        />
        <div className='label'>PHONE</div>
        <div className='subtitle'>
          We use this to notify you when someone contributes to your dream.
        </div>
        <Search
          tag={'+1'}
          placeholder='Phone'
          value={this.state.phoneNumber}
          onChange={v => this.setState({ phoneNumber: v })}
        />
        <div className='label'>LOCATION</div>
        <Input
          value={this.state.location}
          onChange={v => this.setState({ location: v })}
        />
        <div className='label'>ABOUT ME</div>
        <Textarea
          style={{ height: 100 }}
          value={this.state.aboutMe}
          onChange={v => this.setState({ aboutMe: v })}
        />
        <div className='row button-row'>
          <div className='col-sm-8 offset-sm-2 col-md-12 offset-md-0 col-lg-6 offset-lg-3 p-0'>
            <Button
              title='SAVE CHANGES'
              onClick={() => this.handleSubmit(this.props.store)}
            />
          </div>
        </div>

        <style jsx>{`
          .row {
            margin: 0;
          }
          .contain {
            padding: 20px;
            margin-bottom: 60px;
          }
          .title {
            font-size: 1.5em;
          }
          .label {
            margin: 30px 0 10px;
            font-size: 13px;
            font-weight: 700;
            font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
          }
          .dropzone {
            transition: all 0.3s ease;
            height: 80px;
            width: 80px;
            border: 1px solid ${colors.grey[300]};
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            color: ${colors.grey[300]};
            cursor: pointer;
          }
          .photo-row {
            flex-direction: row;
            align-items: center;
          }
          .photo-text {
            margin-left: 15px;
          }
          .avatar {
            height: 80px;
            width: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #e5e5e5;
          }
          .subtitle {
            font-size: 12px;
            padding: 5px 0;
          }
          .button-row {
            margin-top: 50px;
          }
          @media (max-width: 576px) {
            .label {
              margin: 20px 0 10px;
            }
            .contain {
              margin-bottom: 20px;
            }
            .button-row {
              margin-top: 20px;
            }
          }
        `}</style>
      </div>
    )
  }
}

class UpdatePassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      passwordCurrent: '',
      password: '',
      passwordConfirm: '',
      status: '',
      validation: false
    }
  }

  handleSubmit = async store => {
    const { password, passwordConfirm, passwordCurrent } = this.state
    // if there is no password or the passwords dont match, throw
    if (!passwordCurrent || passwordCurrent.length < 8) {
      this.setState({ validation: true })
      return null
    }
    if (!password || password.length < 8) {
      this.setState({ validation: true })
      return null
    }
    if (!(password === passwordConfirm)) {
      this.setState({ validation: true })
      return null
    }

    this.setState({ validation: false })

    try {
      // first you need to try logging in with the provided credentials.
      await firebase
        .auth()
        .signInWithEmailAndPassword(store.currentUser.email, passwordCurrent)
    } catch (err) {
      if (err) {
        this.setState({ status: err.message })
        return null
      }
      console.error(err)
    }
    try {
      await firebase.auth().currentUser.updatePassword(password)
      window.alert('Password updated')
      this.setState({
        passwordCurrent: '',
        password: '',
        passwordConfirm: '',
        status: ''
      })
    } catch (err) {
      console.error(err)
    }
  };

  render () {
    return (
      <div className='contain'>
        <h1 className='title'>Change Password</h1>
        {this.state.status && (
          <div style={{ color: 'red', marginBottom: 10 }}>
            {this.state.status}
          </div>
        )}
        <div className='label'>CURRENT PASSWORD</div>
        <Input
          type='password'
          value={this.state.passwordCurrent}
          onChange={v => this.setState({ passwordCurrent: v })}
          placeholder='Current Password'
          validation={this.state.validation}
          validationText='Your current password must be at least 8 characters.'
        />
        <div className='label'>NEW PASSWORD</div>
        <Input
          type='password'
          value={this.state.password}
          onChange={v => this.setState({ password: v })}
          placeholder='New Password'
          validation={this.state.validation}
          validationText='Your new password must be at least 8 characters.'
        />
        <div className='label'>CONFIRM PASSWORD</div>
        <Input
          type='password'
          value={this.state.passwordConfirm}
          onChange={v => this.setState({ passwordConfirm: v })}
          placeholder='Confirm Password'
          validation={this.state.validation}
          validationText='Your passwords do not match.'
        />
        <div className='row button-row'>
          <div className='col-sm-8 offset-sm-2 col-md-12 offset-md-0 col-lg-6 offset-lg-3 p-0'>
            <Button
              title='SAVE CHANGES'
              onClick={() => this.handleSubmit(this.props.store)}
            />
          </div>
        </div>

        <style jsx>{`
          .row {
            margin: 0;
          }
          .contain {
            padding: 20px;
            margin-bottom: 60px;
          }
          .title {
            font-size: 1.5em;
          }
          .label {
            margin: 30px 0 10px;
            font-size: 13px;
            font-weight: 700;
            font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
          }
          .button-row {
            margin-top: 50px;
          }
          @media (max-width: 576px) {
            .label {
              margin: 20px 0 10px;
            }
            .contain {
              margin-bottom: 20px;
            }
            .button-row {
              margin-top: 20px;
            }
          }
        `}</style>
      </div>
    )
  }
}

class PaymentInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      accounts: [],
      loading: false,
      bank: null
    }
  }

  static contextType = Context;

  componentDidMount () {
    this.getBankData()
  }

  getBankData = () => {
    firebase
      .functions()
      .httpsCallable('getBankAccount')()
      .then(res => {
        console.log('success', res.data)
        this.setState({ bank: res.data })
      })
      .catch(err => console.log('fail', err))
  };

  _handleOnSuccess = async (token, metadata) => {
    // send token to client server
    console.log(token)
    this.setState({ loading: true })
    try {
      const res = await firebase.functions().httpsCallable('createBankAccount')(
        {
          publicToken: token
        }
      )
      console.log(res)
    } catch (err) {
      console.error(err)
    }
    this.getBankData()
    this.setState({ loading: false })
  };

  _handleOnExit () {
    // handle the case when your user exits Link
  }

  _removeBank = async () => {
    const confirm = window.confirm(
      'Are you sure you want to remove this account?'
    )
    if (confirm) {
      this.setState({ loading: true })
      console.log(this.context.currentUser.uid)
      try {
        const res = await firebase
          .functions()
          .httpsCallable('deleteBankAccount')()
        console.log(res)
      } catch (err) {
        console.error(err)
      }
      this.getBankData()
      this.setState({ loading: false })
    }
  };

  _renderHasBank () {
    // NOTE there is only one bank at a time for now
    const { bank } = this.state
    return (
      <div className='bank-contain'>
        {bank.name} ••• {bank.mask}
        <div className='button-row'>
          <PlaidLink
            clientName='Gratitude'
            env={
              process.env.NODE_ENV === 'development' ||
              process.env.SERVER_ENV === 'staging'
                ? PLAID_DEV_ENV
                : PLAID_PROD_ENV
            }
            product={['auth', 'transactions']}
            publicKey={
              process.env.NODE_ENV === 'development' ||
              process.env.SERVER_ENV === 'staging'
                ? PLAID_PUBLIC_KEY_TEST
                : PLAID_PUBLIC_KEY
            }
            onExit={this._handleOnExit}
            onSuccess={this._handleOnSuccess}
            style={{
              backgroundColor: 'white',
              border: 0,
              padding: 0
            }}
          >
            <Button
              style={{
                backgroundColor: 'white',
                color: `#2361FF`,
                border: `2px solid #2361FF`,
                boxShadow: 'none',
                marginRight: '10px',
                fontWeight: '300',
                paddingLeft: '10px',
                paddingRight: '10px'
              }}
              title='Change Bank'
            />
          </PlaidLink>
          <Button
            style={{
              backgroundColor: 'white',
              color: `#D42424`,
              border: `2px solid #D42424`,
              boxShadow: 'none',
              fontWeight: '300',
              paddingLeft: '10px',
              paddingRight: '10px'
            }}
            title='Remove Bank'
            onClick={() => this._removeBank()}
          />
        </div>
        <style jsx>{`
          .bank-contain {
            text-align: center;
            padding: 40px 0;
            margin: 30px 0 160px 0;
            border: 1px solid #dee2e6 !important;
            border-radius: 0.25rem !important;
          }
          .button-row {
            flex-direction: row;
            width: 100%;
            justify-content: center;
            margin-top: 30px;
            align-items: center;
          }
          @media (max-width: 576px) {
            .bank-contain {
              margin: 30px 0 20px 0;
            }
          }
        `}</style>
      </div>
    )
  }

  _renderNoBank () {
    return (
      <div className='bank-contain'>
        No Bank
        <div className='button-row'>
          <PlaidLink
            clientName='Gratitude'
            env={
              process.env.NODE_ENV === 'development' ||
              process.env.SERVER_ENV === 'staging'
                ? PLAID_DEV_ENV
                : PLAID_PROD_ENV
            }
            product={['auth', 'transactions']}
            publicKey={
              process.env.NODE_ENV === 'development' ||
              process.env.SERVER_ENV === 'staging'
                ? PLAID_PUBLIC_KEY_TEST
                : PLAID_PUBLIC_KEY
            }
            onExit={this._handleOnExit}
            onSuccess={this._handleOnSuccess}
            style={{
              backgroundColor: 'white',
              border: 0,
              padding: 0
            }}
          >
            <Button
              style={{
                backgroundColor: 'white',
                color: `#2361FF`,
                border: `2px solid #2361FF`,
                boxShadow: 'none',
                fontWeight: '300',
                paddingLeft: '10px',
                paddingRight: '10px'
              }}
              title='Add a Bank'
              onClick={() => {}}
            />
          </PlaidLink>
        </div>
        <style jsx>{`
          .bank-contain {
            text-align: center;
            padding: 40px 0;
            margin: 30px 0 160px 0;
            border: 1px solid #dee2e6 !important;
            border-radius: 0.25rem !important;
          }
          .button-row {
            flex-direction: row;
            width: 100%;
            justify-content: center;
            margin-top: 30px;
            align-items: center;
          }
          @media (max-width: 576px) {
            .bank-contain {
              margin: 30px 0 20px 0;
            }
          }
        `}</style>
      </div>
    )
  }

  render () {
    const isEmpty = this.state.bank === null
    return (
      <div className='contain'>
        <Loading loading={this.state.loading} />
        <h1 className='title'>Account Balance</h1>
        <div className='subtitle'>
          Your balance will be held witth us until you connect your bank account
          below for payouts.
        </div>
        <div className='bank-contain'>
          $
          {this.props.user.balance !== undefined
            ? parseFloat(this.props.user.balance / 100).toFixed(2)
            : '0.00'}
        </div>
        <h1 className='title'>Bank Account</h1>
        <div className='subtitle'>
          We use this to send out your monetary contributions on a weekly basis.
        </div>
        {isEmpty ? this._renderNoBank() : this._renderHasBank()}
        <style jsx>{`
          .row {
            margin: 0;
          }
          .contain {
            padding: 20px;
          }
          .title {
            font-size: 1.5em;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 14px;
          }
          .bank-contain {
            font-size: 2.5em;
            text-align: center;
            padding: 40px 0;
            margin: 30px 0;
            border: 1px solid #dee2e6 !important;
            border-radius: 0.25rem !important;
          }
        `}</style>
      </div>
    )
  }
}

const renderContent = (self, user, store) => {
  if (self.state.activeTab === 'general') {
    return <GeneralInformation user={user} store={store} />
  }
  if (self.state.activeTab === 'password') {
    return <UpdatePassword user={user} store={store} />
  }
  if (self.state.activeTab === 'payment') {
    return <PaymentInfo user={user} store={store} />
  }
  return <div>this should not be here. something went wrong</div>
}

const renderTab = (self, store) => {
  return (
    <div className='contain'>
      <div
        onClick={() => self.setState({ activeTab: 'general' })}
        className='tab'
      >
        <div
          className={`tab-title ${
            self.state.activeTab === 'general' ? 'active' : ''
          }`}
        >
          General Information
        </div>
        <div className='arrow'>&gt;</div>
      </div>
      <div
        onClick={() => self.setState({ activeTab: 'password' })}
        className='tab'
      >
        <div
          className={`tab-title ${
            self.state.activeTab === 'password' ? 'active' : ''
          }`}
        >
          Change Password
        </div>
        <div className='arrow'>&gt;</div>
      </div>
      <div
        onClick={() => self.setState({ activeTab: 'payment' })}
        className='tab'
      >
        <div
          className={`tab-title ${
            self.state.activeTab === 'payment' ? 'active' : ''
          }`}
        >
          Payment Info
        </div>
        <div className='arrow'>&gt;</div>
      </div>
      <div className='tab privacy'>
        <div className={`tab-title privacy-title`}>
          Privacy & Data Protection
        </div>
        <div className='privacy-text'>
          Gratitude has a strong commitment to respect and protect your personal
          data. Currently, as we are in beta testing, all contributions are
          public. We use your email and phone number for notifications and do
          not make that information public.
        </div>
      </div>
      <div
        onClick={() => {
          store.signOut()
          window.location = '/'
        }}
        className='tab'
      >
        <div className={`tab-title`}>Log out</div>
        <div className='arrow' />
      </div>

      <style jsx>{`
        .contain {
          padding: 0 20px;
        }
        .active {
          color: #23535d;
        }
        .privacy-text {
          font-size: 12px;
          line-height: initial;
        }
        .privacy {
          flex-direction: column !important;
          align-items: flex-start !important;
        }
        .privacy-title {
          margin-bottom: 15px;
        }
        .tab {
          cursor: pointer;
          padding: 20px;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid ${colors.grey[300]};
          transition: all 0.2s ease;
        }

        @media (max-width: 576px) {
          .contain {
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTab: 'general' // 'general', 'password', 'payment'
    }
  }

  componentDidMount () {
    if (this.props.store.currentUser.uid === undefined) {
      this.props.router.push('/login')
    }
  }

  render () {
    return (
      <Context.Consumer>
        {store => {
          if (!store.currentUser.uid) return null
          return (
            <Data query={db.collection('users').doc(store.currentUser.uid)}>
              {({ data: user, loading }) => {
                if (loading) return <Loading loading />
                return (
                  <Format>
                    <Head />
                    <Navbar />
                    <Layout>
                      <div className='contain row'>
                        <div className='col-lg-4 col-md-5 p-0'>
                          {renderTab(this, store)}
                        </div>
                        <div className='col-lg-8 col-md-7 p-0'>
                          {renderContent(this, user, store)}
                        </div>
                      </div>
                      <style jsx>{`
                        .row {
                          margin: 0;
                        }
                        .contain {
                          margin-top: 50px;
                        }
                        @media (max-width: 576px) {
                          .contain {
                            margin: 0;
                          }
                        }
                      `}</style>
                    </Layout>
                    <Footer />
                  </Format>
                )
              }}
            </Data>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default withRouter(Settings)
