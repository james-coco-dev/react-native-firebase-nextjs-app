import React from 'react'
import { Loading, Data } from '@corcos/components'
import StripeCheckout from 'react-stripe-checkout'
import { withRouter } from 'next/router'
import { colors, getFileAsBinary, uploadImage } from '@corcos/lib'
import Dropzone from 'react-dropzone'
import moment from 'moment'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

import {
  Head,
  Navbar,
  Footer,
  Textarea,
  Button,
  Input,
  Format,
  Search,
  Layout
} from '../../components'

import Context from '../../lib/context'
import { db, firebase } from '../../lib/firebase'
const {
  STRIPE_PUBLISH_KEY,
  STRIPE_PUBLISH_KEY_TEST
} = require('../../lib/credential')
const { PRODUCTION_DREAM_DETAIL_URL } = require('../../lib/constant')

const setAmount = (amount, self) => {
  // https://forums.asp.net/t/1909870.aspx?Regular+expression+to+allow+a+number+upto+2+decimal+places
  // allow any number (and only numbers) up to two decimal places
  if (/^\d*\.?\d{0,2}?$/.test(amount)) {
    self.setState({ amount })
  } else {
    console.error('not a number')
  }
}

const onToken = async (t, self, dream) => {
  if (!/@/g.test(self.state.email)) {
    window.alert('Must include a valid email')
    return null
  }

  self.setState({ loading: true })
  // convert number from dollars to cents the hacky way
  const twoDecimalPlaces = Number(self.state.amount).toFixed(2)
  const cents = twoDecimalPlaces * 100
  try {
    await firebase.functions().httpsCallable('createContribution')({
      source: t.id,
      amount: cents,
      message: self.state.message,
      name: self.state.name,
      sourceString: self.state.name,
      email: self.state.email,
      dreamId: self.props.query.dreamId,
      method: dream.method
    })
    await self.props.router.push({
      pathname: '/dreams/thank-you',
      query: { dreamId: dream.id }
    })
  } catch (err) {
    console.error(err)
  }
  self.setState({ loading: false })
}

const submitMessage = async (self, dream) => {
  self.setState({ loading: true })
  try {
    await firebase.functions().httpsCallable('createContribution')({
      message: self.state.message,
      email: self.state.email,
      name: self.state.name,
      sourceString: self.state.sourceString,
      dreamId: self.props.query.dreamId,
      method: dream.method
    })
    await self.props.router.push({
      pathname: '/dreams/thank-you',
      query: { dreamId: dream.id }
    })
  } catch (err) {
    console.error(err)
  }
  self.setState({ loading: false })
}

const sendMail = async (self, dream, user) => {
  if (!/@/g.test(self.state.sendDream)) {
    window.alert('Invalid email')
    return null
  }
  self.setState({ loading: true })
  try {
    await firebase.functions().httpsCallable('sendDream')({
      sendTo: self.state.sendDream,
      dream,
      user
    })
    self.setState({ sendDream: '', loading: false })
    window.alert('Sent!')
  } catch (err) {
    window.alert('There was an error sending your message.')
    self.setState({ sendTo: '', loading: false })
    console.error(err)
  }
}

const showProfile = async (self, user) => {
  await window.open(`/@${user.username}`, '_blank')
}

const YourDream = props => {
  if (!props.active) return null
  return (
    <div className='contain'>
      <div className='inner'>
        <div>This is your dream</div>
        <Button
          style={{
            backgroundColor: 'white',
            color: `#23535D`,
            border: `1px solid #23535D`,
            paddingTop: 10,
            paddingBottom: 10,
            boxShadow: 'none'
          }}
          title='Edit dream'
          onClick={() =>
            props.router.push({
              pathname: '/dreams/edit',
              query: { dreamId: props.query.dreamId }
            })
          }
        />
      </div>

      <style jsx>{`
        .button:hover {
          opacity: 0.6;
        }
        .contain {
          background-color: #fafbfd;
          height: 80px;
          border-bottom: 1px solid ${colors.grey[300]};
          align-items: center;
        }
        .inner {
          width: 1140px;
          flex-direction: row;
          justify-content: space-between;
          height: 80px;
          padding: 8px 16px;
          align-items: center;
        }
        @media (max-width: 1140px) {
          .inner {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

const TermAndPrivacy = () => {
  return (
    <>
      <small className='fine-print'>
        By clicking Send Now, you agree to our&nbsp;
        <a href='/terms' className='fine-print-text-underline'>
          Terms of Service&nbsp;
        </a>
        and&nbsp;
        <a href='/privacy' className='fine-print-text-underline'>
          Privacy Policy,&nbsp;
        </a>
        and agree to receive updates from this user.
      </small>
      <style jsx>{`
        .fine-print {
          flex-direction: row;
          font-size: 13px;
          color: #9da5af;
          padding: 15px 15px 0;
          line-height: initial;
        }
        .fine-print-text-underline {
          font-size: 13px !important;
          color: #9da5af;
          text-decoration: underline;
          display: contents;
        }
      `}</style>
    </>
  )
}

const DreamRecipient = (self, user, dream) => {
  return (
    <>
      {dream.method === 'donation' ? (
        <div className='recipient-profile'>
          <div className='recipient inputLabel'>RECIPIENT</div>
          <div
            className='row'
            style={{ cursor: 'pointer' }}
            onClick={() => showProfile(self, user)}
          >
            <img
              className='avatar avatarDefaultBG'
              src='/static/user-placeholder.png'
            />
            <div className='profile-details'>
              <h4 className='name'>{dream.charity.charityName}</h4>
              <div className='location'>
                {dream.charity.irsClassification.classification}
              </div>
              <div className='ein'>{`EIN : ${dream.charity.ein}`}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className='recipient-profile'>
          <div className='recipient inputLabel'>RECIPIENT</div>
          <div
            className='row'
            style={{ cursor: 'pointer' }}
            onClick={() => showProfile(self, user)}
          >
            <img
              className='avatar avatarDefaultBG'
              src={user.avatarUrl || '/static/user-placeholder.png'}
            />
            <div className='profile-details'>
              <h4 className='name'>{user.fullName}</h4>
              <div className='location'>{user.location}</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .row {
          margin: 0;
        }
        .inputLabel {
          font-size: 13px;
          font-weight: 700;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
        }
        .recipient-profile {
          border-bottom: 1px solid ${colors.grey[300]};
          padding: 15px;
        }
        .recipient {
          margin-bottom: 10px;
        }
        .location,
        .ein {
          font-size: 14px;
          color: ${colors.grey[600]};
          margin-top: 5px;
        }
        .profile-details {
          justify-content: center;
        }
        .avatar {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 10px;
          border: 3px solid #e5e5e5;
        }
      `}</style>
    </>
  )
}

const DreamPayment = self => {
  return (
    <>
      <div className='subtitle inputLabel'>CONTRIBUTION AMOUNT</div>
      <Search
        tag={'$'}
        placeholder='50'
        value={self.state.amount}
        onChange={v => setAmount(v, self)}
      />

      {/* <div className='subtitle inputLabel'>NAME ON CARD</div>
      <Input
        value={self.state.email}
        onChange={v => self.setState({ email: v })}
      /> */}
      {/* <div className='payment'>
        <div className='payment-subtitle inputLabel'>
          NAME ON CARD
          <img
            src={'/static/img/payment/payment-card.png'}
            className='payment-icon'
          />
        </div>

        <div className='payment-content row'>
          <div className='card-number'>4242 4242 4242 4242</div>
          <div className='card-date'>06/23</div>
          <div className='card-cvc'>815</div>
        </div>
        <div className='payment-footer'>
          <img
            src={'/static/img/payment/payment-security.png'}
            className='security-icon'
          />
          <div className='payment-sub'>
            Secure payment processing by Stripe. If you have any questions,
            please visit our FAQ.
          </div>
        </div>
      </div> */}
      <style jsx>{`
        .row {
          margin: 0;
        }
        .card-number {
          width: 60%;
          padding-right: 5px;
        }
        .card-date {
          width: 25%;
          padding-right: 5px;
        }
        .card-cvc {
          width: 15%;
        }
        .inputLabel {
          font-size: 13px;
          font-weight: 700;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
        }
        .payment-subtitle {
          flex-direction: row;
          margin: 15px 0 5px 0;
          justify-content: space-between;
        }
        .payment-content {
          border: 1px solid #eeeeee;
          padding: 12px 5px;
          border-radius: 3px;
        }
        .payment-footer {
          flex-direction: row;
          margin-top: 10px;
        }
        .payment-sub {
          font-size: 13px;
          margin-left: 15px;
          line-height: initial;
          align-self: center;
        }
        .security-icon {
          height: 35.5px;
          align-self: center;
        }
        .payment-icon {
          height: 18px;
          align-self: flex-end;
        }
        .subtitle {
          margin: 15px 0 5px 0;
        }
        @media (max-width: 576px) {
          .card-number,
          .card-date,
          .card-cvc {
            font-size: 14px;
          }
          .payment-sub {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  )
}

const contentIsValid = (self, data) => {
  if (data.method === 'money') {
    // if the method is money, we require email, message, and amount
    if (!self.state.name) return false
    if (!self.state.email) return false
    if (!self.state.amount) return false
    if (!self.state.message) return false
  }

  if (data.method === 'charity') {
    // if the method is charity, we require email, message, and amount
    if (!self.state.name) return false
    if (!self.state.email) return false
    if (!self.state.amount) return false
    if (!self.state.message) return false
  }

  if (data.method === 'message') {
    // if the method is message, require name, email, message
    if (!self.state.name) return false
    if (!self.state.message) return false
    if (!self.state.email) return false
  }

  return true
}

// determines which button to render
const renderButton = (self, data) => {
  // if the content is valid, render a button that can submit based on type
  if (contentIsValid(self, data)) {
    if (data.method === 'message') {
      return (
        // if the type is method, return a button that submits the message
        <Button title='SEND NOW' onClick={() => submitMessage(self, data)} />
      )
    }
    return (
      // if the method requires payment, render a button that is wrapped with the stripe wrapper
      <StripeCheckout
        email={self.state.email}
        token={t => onToken(t, self, data)}
        // NOTE not sure if this will work if process.env isn't being passed through
        stripeKey={
          process.env.NODE_ENV === 'development' ||
          process.env.SERVER_ENV === 'staging'
            ? STRIPE_PUBLISH_KEY_TEST
            : STRIPE_PUBLISH_KEY
        }
      >
        <Button title='SEND NOW' onClick={() => {}} />
      </StripeCheckout>
    )
  }

  return (
    // otherwise, render a button that shows an error
    <Button
      title='SEND NOW'
      onClick={() =>
        window.alert(
          'Looks like you missed something! Make sure you have all the fields filled out.'
        )
      }
    />
  )
}

const RenderContributionType = (data, user, self) => {
  return (
    <div className='contain'>
      {DreamRecipient(self, user, data)}
      <div className='recipient-data'>
        {!self.state.yourDream && (
          <>
            <div className='subtitle inputLabel'>YOUR NAME</div>
            <Input
              placeholder='Enter your name'
              value={self.state.name}
              onChange={v => self.setState({ name: v })}
            />
            <div className='subtitle inputLabel'>YOUR EMAIL</div>
            <Input
              placeholder='Enter your email address'
              value={self.state.email}
              onChange={v => self.setState({ email: v })}
            />
          </>
        )}
        <div className='subtitle inputLabel'>MESSAGE</div>
        <Textarea
          value={self.state.message}
          placeholder='I support this dream because…'
          onChange={v => self.setState({ message: v })}
        />
        {data.method === 'message' ? (
          <>
            <div className='subtitle inputLabel'>ATTACH MEDIA</div>
            <Dropzone onDrop={self.onDrop}>
              {({ getRootProps, getInputProps, isDragActive }) => {
                const inputProps = getInputProps()
                const rootProps = getRootProps()
                return (
                  <div
                    {...rootProps}
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                  >
                    <input {...inputProps} />
                    {self.state.filename === ''
                      ? 'Upload photo or video'
                      : 'Change photo or video'}
                    <label className='filename'>{self.state.filename}</label>
                  </div>
                )
              }}
            </Dropzone>
          </>
        ) : (
          DreamPayment(self)
        )}
      </div>
      {TermAndPrivacy()}
      <div className='send-button'>{renderButton(self, data)}</div>
      <style jsx>{`
        .inputLabel {
          font-size: 13px;
          font-weight: 700;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
        }
        .contain {
          user-select: ${self.state.yourDream ? 'none' : 'inherit'};
          background-color: ${self.state.yourDream ? 'white' : 'inherit'};
          opacity: ${self.state.yourDream ? 0.5 : 1};
          pointer-events: ${self.state.yourDream ? 'none' : 'inherit'};
          border: 1px solid ${colors.grey[300]};
          border-radius: 5px;
        }
        .row {
          margin: 0;
        }
        .subtitle {
          margin: 15px 0 5px 0;
        }
        .recipient-data {
          border-bottom: 1px solid ${colors.grey[300]};
          padding: 15px;
        }
        .send-button {
          padding: 15px;
        }
        .filename {
          font-size: 12px;
          color: #23535d;
          padding-top: 20px;
        }
        .dropzone {
          border: 1px dashed ${colors.grey[300]};
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border-radius: 5px;
          border-width: 3px;
          border-height: 1px;
          padding: 10px 30px 50px 30px;
        }
      `}</style>
    </div>
  )
}

const Contributor = c => {
  return (
    <div className='contribution-cell'>
      <div className='avatar-container'>
        <img
          src={'/static/user-placeholder.png'}
          className='icon avatarDefaultBG'
        />
      </div>
      <div className='contain'>
        <div className='contributorName'>{c.name || 'Anomymous'}</div>
        <div className='from-now'>
          {moment(c.createdAt.seconds * 1000).fromNow()}
        </div>
      </div>

      <style jsx>{`
        .contain {
          overflow: hidden;
        }
        .contribution-cell {
          background-color: white;
          border: 1px solid ${colors.grey[300]};
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 15px;
          align-items: center;
          flex-direction: row;
        }
        .contributorName {
          font-weight: 700;
        }
        .avatar-container {
          margin-right: 10px;
        }
        .avatarDefaultBG {
          background-image: url(/static/user-placeholder.png);
          background-size: cover;
          background-position: center;
        }
        .from-now {
          margin-top: 5px;
          color: #9da5af;
          font-size: 13px;
        }
        .icon {
          flex-shrink: 0;
          height: 60px;
          width: 60px;
          border-radius: 50%;
          border: 3px solid #e5e5e5;
        }
      `}</style>
    </div>
  )
}

const DreamEmail = self => {
  return (
    <>
      <Data query={db.collection('dreams').doc(self.props.query.dreamId)}>
        {({ data: dream, loading }) => {
          if (loading) return null
          return (
            <Data query={db.collection('users').doc(dream.createdBy)}>
              {({ data: user, loading }) => {
                return (
                  <div className='contribute-row'>
                    <h1 className='c-title'>Send this dream to someone</h1>
                    <div className='c-subtitle'>
                      We will send a message with a link to this dream. We don't
                      encourage spam, so please send wisely!
                    </div>
                    <div className='input-row'>
                      <input
                        placeholder='Enter email'
                        value={self.state.sendDream}
                        onChange={e =>
                          self.setState({ sendDream: e.target.value })
                        }
                        className='input'
                      />
                      <div className='button'>
                        <Button
                          style={{
                            padding: '15px 40px'
                          }}
                          title='SEND'
                          onClick={() => sendMail(self, dream, user)}
                        />
                      </div>
                      <div className='button-mob'>
                        <Button
                          style={{
                            padding: '10px 20px',
                            fontSize: '14px'
                          }}
                          title='SEND'
                          onClick={() => sendMail(self, dream, user)}
                        />
                      </div>
                    </div>
                  </div>
                )
              }}
            </Data>
          )
        }}
      </Data>

      <style jsx>{`
        .input-row {
          width: 50%;
          position: relative;
          margin-top: 15px;
        }
        .input {
          background-color: white;
          height: 80px;
          border: none;
          border-radius: 5px;
          font-size: 1.5rem;
          padding-left: 30px;
        }
        .input::placeholder {
          color: ${colors.grey[400]};
        }
        .button {
          position: absolute;
          top: 18px;
          right: 20px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.2s ease;
        }
        .button:hover {
          opacity: 0.5;
        }
        .c-title {
          font-size: 2em;
          color: #23535d;
          text-align: center;
          margin-bottom: 15px;
        }
        .c-subtitle {
          font-size: 1.3em;
          color: #23535d;
          font-weight: 400;
          text-align: center;
          width: 40%;
          line-height: 1.3em;
        }
        .contribute-row {
          background-color: #dbece5;
          width: 100%;
          margin-top: 50px;
          padding: 6rem 0;
          align-items: center;
          justify-content: center;
        }
        .contribute-row-mobile {
          width: 100%;
          padding: 1rem 0;
          margin-top: 5px;
          display: none;
          background-color: #23535d;
        }
        .button-mob {
          position: absolute;
          top: 6px;
          right: 5px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.2s ease;
          display: none;
        }
        @media (max-width: 576px) {
          .button-mob {
            display: block;
          }
          .button {
            display: none;
          }
          .contribute-row {
            margin-top: 20px;
            padding: 1rem 0;
          }
          .c-title {
            font-size: 1.2em;
          }
          .c-subtitle {
            font-size: 1em;
          }
          .input {
            height: 45px;
            font-size: 1em;
            padding-left: 15px;
          }
        }
        @media (max-width: 780px) {
          .c-title {
            width: 90%;
            text-align: left;
          }
          .c-subtitle {
            width: 90%;
            text-align: left;
          }
          .input-row {
            width: 90%;
          }
        }
      `}</style>
    </>
  )
}

class Dreams extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      email: '',
      message: '',
      name: '',
      sourceString: '',
      filename: '',
      loading: false,
      yourDream: false,
      sendDream: ''
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.userDream', {
      // dreamTitle: 'Build 10 Homes' ,
      // userFullName: 'Jane Doe' ,
      // userEmail: 'test@test.com'
    })
  }

  static getInitialProps = async ({ query }) => {
    let dream
    try {
      const res = await db
        .collection('dreams')
        .doc(query.dreamId)
        .get()
      dream = res.data()
    } catch (err) {
      console.error(err)
    }
    let user
    try {
      const res = await db
        .collection('users')
        .doc(dream.createdBy)
        .get()
      user = res.data()
    } catch (err) {
      console.error(err)
    }
    return { query, dream, user }
  };

  onDrop = async (acceptedFiles, rejectedFiles) => {
    this.setState({ loading: true })
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
        path: `/dream-cover/${this.context.currentUser.uid}?${Date.now()}`,
        file
      })
    } catch (err) {
      console.error(err)
    }

    await this.setState({
      sourceString: url,
      filename: acceptedFiles[0].name,
      loading: false
    })
  };

  static contextType = Context;

  render () {
    return (
      <Format>
        <Head
          ogUrl={PRODUCTION_DREAM_DETAIL_URL + this.props.query.dreamId}
          ogTitle={this.props.dream.title}
          ogDescription={`Contribute to ${this.props.user.fullName}'s Dream: ${
            this.props.dream.title
          }`}
          ogImage={this.props.dream.imageUrl}
        />
        <Navbar />
        <Loading loading={this.state.loading} />
        <YourDream active={this.state.yourDream} {...this.props} />
        <div className='contain'>
          <Data query={db.collection('dreams').doc(this.props.query.dreamId)}>
            {({ data, loading }) => {
              if (loading) return null
              if (!this.state.yourDream) {
                // if it is not yet set that this is the dream of the user
                if (data.createdBy === this.context.currentUser.uid) {
                  // TODO this is bad practice, but it will do for now
                  this.setState({ yourDream: true })
                }
              }
              return (
                <Layout>
                  <Data query={db.collection('users').doc(data.createdBy)}>
                    {({ data: user = {} }) => {
                      return (
                        <>
                          <h1 className='title'>{data.title}</h1>
                          <div className='row'>
                            <div className='col-md-8 col-sm-12'>
                              <img
                                src={data.imageUrl}
                                className='defaultDreamBG image rounded'
                                alt='Image'
                              />
                              <div className='button-row row'>
                                <div className='col-sm-3 col-xs-12'>
                                  <FacebookShareButton
                                    quote={`Contribute to ${
                                      user.fullName
                                    }'s Dream: ${data.title}`}
                                    url={
                                      PRODUCTION_DREAM_DETAIL_URL +
                                      this.props.query.dreamId
                                    }
                                  >
                                    <Button
                                      style={{
                                        backgroundColor: '#284797',
                                        color: `white`,
                                        border: `1px solid #284797`,
                                        boxShadow: 'none',
                                        fontWeight: '700'
                                      }}
                                      title='SHARE'
                                      onClick={() => {
                                        try {
                                          // NOTE:ARMAAN within a button that you want to track, you can use
                                          // window.analytics.track. You should also be able to add onClick to
                                          // just about any component that you want to track and it should track
                                          // them as well.
                                          // For example:
                                          window.analytics.track(
                                            'c.website.userDream.shareFacebook',
                                            {
                                              // dreamTitle: 'Build 10 Homes' ,
                                              // userFullName: 'Jane Doe' ,
                                              // userEmail: 'test@test.com'
                                              location: 'left',
                                              color: 'navy blue',
                                              text: 'Share',
                                              CTA: 'Facebook',
                                              category: 'Shares',
                                              type: 'Button',
                                              pageTitle: document.title,
                                              pagePathURL: location.pathname,
                                              pageURL: location.href
                                            }
                                          )
                                        } catch (err) {
                                          console.error(err)
                                        }
                                      }}
                                    />
                                  </FacebookShareButton>
                                </div>
                                <div className='col-sm-3 col-xs-12'>
                                  <TwitterShareButton
                                    title={`Contribute to ${
                                      user.fullName
                                    }'s Dream: ${data.title}`}
                                    url={
                                      PRODUCTION_DREAM_DETAIL_URL +
                                      this.props.query.dreamId
                                    }
                                  >
                                    <Button
                                      style={{
                                        backgroundColor: '#35aaf6',
                                        color: `white`,
                                        border: `1px solid #35aaf6`,
                                        boxShadow: 'none',
                                        fontWeight: '700'
                                      }}
                                      title='TWEET'
                                      onClick={() => {
                                        try {
                                          window.analytics.track(
                                            'c.website.userDream.shareTwitter',
                                            {
                                              // dreamTitle: 'Build 10 Homes' ,
                                              // userFullName: 'Jane Doe' ,
                                              // userEmail: 'test@test.com'
                                              location: 'left',
                                              color: 'sky blue',
                                              text: 'Tweet',
                                              CTA: 'Twitter',
                                              category: 'Shares',
                                              type: 'Button',
                                              pageTitle: document.title,
                                              pagePathURL: location.pathname,
                                              pageURL: location.href
                                            }
                                          )
                                        } catch (err) {
                                          console.error(err)
                                        }
                                      }}
                                    />
                                  </TwitterShareButton>
                                </div>

                                <div className='col-sm-3 col-xs-12'>
                                  <a
                                    style={{ textDecoration: 'none' }}
                                    href={`mailto:?subject=Contribute to ${
                                      user.fullName
                                    }'s Dream: ${
                                      data.title
                                    }&body=${window.encodeURIComponent(
                                      PRODUCTION_DREAM_DETAIL_URL +
                                        this.props.query.dreamId
                                    )}`}
                                  >
                                    <Button
                                      style={{
                                        backgroundColor: '#dbece5',
                                        color: `#23535D`,
                                        border: `0px solid #23535D`,
                                        boxShadow: 'none',
                                        fontWeight: '700'
                                      }}
                                      title='EMAIL'
                                      onClick={() => {
                                        try {
                                          window.analytics.track(
                                            'c.website.userDream.shareEmail',
                                            {
                                              // dreamTitle: 'Build 10 Homes' ,
                                              // userFullName: 'Jane Doe' ,
                                              // userEmail: 'test@test.com'
                                              location: 'left',
                                              color: 'light green',
                                              text: 'Email',
                                              CTA: 'Email Client',
                                              category: 'Shares',
                                              type: 'Button',
                                              pageTitle: document.title,
                                              pagePathURL: location.pathname,
                                              pageURL: location.href
                                            }
                                          )
                                        } catch (err) {
                                          console.error(err)
                                        }
                                      }}
                                    />
                                  </a>
                                </div>

                                <div className='col-sm-3 col-xs-12'>
                                  <Button
                                    style={{
                                      backgroundColor: '#dbece5',
                                      color: `#23535D`,
                                      border: `0px solid #23535D`,
                                      boxShadow: 'none',
                                      fontWeight: '700'
                                    }}
                                    title='COPY LINK'
                                    onClick={async () => {
                                      try {
                                        await navigator.clipboard.writeText(
                                          PRODUCTION_DREAM_DETAIL_URL +
                                            this.props.query.dreamId
                                        )
                                        window.alert('Copied to clipboard!')
                                        window.analytics.track(
                                          'c.website.userDream.shareCopyLink',
                                          {
                                            // dreamTitle: 'Build 10 Homes' ,
                                            // userFullName: 'Jane Doe' ,
                                            // userEmail: 'test@test.com'
                                            location: 'left',
                                            color: 'light green',
                                            text: 'Copy link',
                                            CTA: 'Copy Link',
                                            category: 'Shares',
                                            type: 'Button',
                                            pageTitle: document.title,
                                            pagePathURL: location.pathname,
                                            pageURL: location.href
                                          }
                                        )
                                      } catch (err) {
                                        console.error(err)
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <div className='story'>{data.story}</div>

                              <div className='row hashtag-row'>
                                {data.hashtags &&
                                  Object.keys(data.hashtags).map((t, i) => (
                                    <div key={t + i} className='tag'>
                                      #{t.toUpperCase()}
                                    </div>
                                  ))}
                              </div>
                              <div className='contributors'>
                                <h1 className='contributor-title'>
                                  Contributors
                                </h1>
                                <div className='contributor-row row'>
                                  <Data
                                    query={db
                                      .collection('contributions')
                                      .where(
                                        'dreamId',
                                        '==',
                                        this.props.query.dreamId
                                      )}
                                  >
                                    {({ data: contributions, loading }) => {
                                      const contribs = Object.keys(
                                        contributions
                                      ).map(key => contributions[key])

                                      return contribs.length === 0 ? (
                                        <h4 className='no-contributor'>
                                          No Contributors
                                        </h4>
                                      ) : (
                                        contribs.map(c => {
                                          return (
                                            <div
                                              key={c.id}
                                              className='col-md-6'
                                            >
                                              {Contributor(c)}
                                            </div>
                                          )
                                        })
                                      )
                                    }}
                                  </Data>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                              <Data
                                query={db
                                  .collection('users')
                                  .doc(data.createdBy)}
                              >
                                {({ data: user, loading }) => {
                                  return RenderContributionType(
                                    data,
                                    user,
                                    this
                                  )
                                }}
                              </Data>
                            </div>
                          </div>
                        </>
                      )
                    }}
                  </Data>
                </Layout>
              )
            }}
          </Data>
        </div>
        {DreamEmail(this)}
        <Footer />

        <style jsx>{`
          .contain {
            padding: 0 1rem;
            margin-top: 50px;
          }
          .title {
            text-align: center;
            font-size: 34px;
            margin-bottom: 30px;
          }
          .image {
            height: 400px;
            width: 100%;
            object-fit: cover;
            margin-bottom: 5px;
          }
          .defaultDreamBG {
            background-image: url(/static/img/dreamDefaultImage.png);
            background-size: cover;
            background-position: center;
          }
          .button-row {
            flex-direction: row;
            width: 100%;
            justify-content: center;
            margin-top: 15px;
            align-items: center;
          }
          .story {
            margin-top: 20px;
            line-height: 1.5;
          }
          .hashtag-row {
            flex-direction: row;
            margin: 0;
            margin-top: 15px;
          }
          .tag {
            padding: 10px 20px;
            border: 1px solid #d5d5d5;
            border-radius: 20px;
            color: #737273;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 10px;
          }
          .contributors {
            border-radius: 10px;
            background-color: rgba(219, 236, 229, 0.2);
            margin-top: 30px;
            padding: 30px;
          }
          .contributor-title {
            font-size: 30px;
            margin-bottom: 30px;
          }
          .no-contributor {
            padding-left: 15px;
            font-size: 18px;
          }
          @media (max-width: 576px) {
            .contain {
              margin-top: 20px;
            }
            .title {
              text-align: left;
              font-size: 1.25rem;
              line-height: 1.2;
              margin-bottom: 20px;
            }
            .image {
              max-height: 200px;
              margin-bottom: 15px;
            }
            .story {
              margin-top: 0px;
              font-size: 0.895rem;
              line-height: 1.25;
            }
            .contributors,
            .tag,
            .button-row {
              display: none;
            }
          }
        `}</style>
      </Format>
    )
  }
}

export default withRouter(Dreams)
