import React from 'react'
import { Data, Loading } from '@corcos/components'
import { colors } from '@corcos/lib'
import { Head, Navbar, Button, Footer, Layout, Format } from '../../components'
import { db, firebase } from '../../lib/firebase'
import Context from '../../lib/context'

// if story is too long, truncate
const formatStory = story => {
  if (story !== undefined) {
    if (story.length > 220) {
      return `${story.slice(0, 220)}...`
    }
  }
  return story
}

// This component is needed because the uid will either be from context or from the query params
const Content = self => {
  let uid
  if (self.props.query.id) {
    uid = self.props.query.id
  } else if (self.context.currentUser.uid) {
    uid = self.context.currentUser.uid
  } else {
    return null
  }
  return (
    <Data query={db.collection('users').doc(uid)}>
      {({ data, loading }) => {
        if (loading) return <Loading loading />
        return (
          <>
            <div className='contain'>
              <div className='profile-top'>
                <div>
                  <img
                    src={data.avatarUrl || '/static/user-placeholder.png'}
                    className='large-avatar'
                  />
                </div>
                <div className='details-col'>
                  <h1 className='name'>{data.fullName}</h1>
                  <div className='location'>{data.location}</div>
                </div>
              </div>
              <div className='bio'>{data.aboutMe}</div>
            </div>
            <div className='contain'>
              <div className='line' />
              <Data
                query={db.collection('dreams').where('createdBy', '==', uid)}
              >
                {({ data: total, loading2 }) => {
                  const totalIter = Object.keys(total).map(key => total[key])
                  return (
                    <Data
                      query={db
                        .collection('dreams')
                        .where('createdBy', '==', uid)
                        .orderBy('createdAt', 'desc')
                        .limit(self.state.pageCount * 5)}
                    >
                      {({ data: dreams, loading2 }) => {
                        const iterable = Object.keys(dreams).map(
                          key => dreams[key]
                        )
                        return iterable.length === 0 ? (
                          <h3 className='no-more-dream'>No Dream</h3>
                        ) : (
                          <>
                            {iterable.map(d => (
                              <div key={d.id} className='dream-row'>
                                <img
                                  className='image rounded'
                                  src={d.imageUrl}
                                />
                                <div className='content-col'>
                                  <h3 className='dream-title'>{d.title}</h3>
                                  <div className='description'>
                                    {formatStory(d.story)}
                                  </div>
                                  <div className='dream-footer row'>
                                    <div className='contributors'>
                                      <span className='fa fa-user' />
                                      {d.contributionCount ||
                                        'Be the first to contribute'}
                                      {d.contributionCount !== undefined &&
                                        'contributed to this dream'}
                                    </div>
                                    <div className='contribute-button'>
                                      <Button
                                        style={{
                                          paddingLeft: '40px',
                                          paddingRight: '40px'
                                        }}
                                        title='CONTRIBUTE'
                                        onClick={() =>
                                          window.open(
                                            '/dreams?dreamId=' + d.id,
                                            '_blank'
                                          )
                                        }
                                      />
                                    </div>
                                    <div className='contributors-mobile'>
                                      {d.contributionCount || 'Be the first'}
                                      {d.contributionCount !== undefined &&
                                        'contributors'}
                                    </div>
                                    <div className='contribute-mobile-button'>
                                      <Button
                                        style={{
                                          padding: '10px 10px',
                                          fontSize: '12px',
                                          fontWeight: '700'
                                        }}
                                        title='CONTRIBUTE'
                                        onClick={() =>
                                          window.open(
                                            '/dreams?dreamId=' + d.id,
                                            '_blank'
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {totalIter.length === iterable.length ? (
                              <h3 className='no-more-dream'>No More</h3>
                            ) : (
                              <Button
                                title='LOAD MORE'
                                style={{
                                  width: '100%',
                                  backgroundColor: '#DBECE5',
                                  color: `#23535D`,
                                  border: `1px solid rgba(35, 83, 93, 0.25)`,
                                  boxShadow: `none`
                                }}
                                onClick={self.handleLoadmore}
                              />
                            )}
                          </>
                        )
                      }}
                    </Data>
                  )
                }}
              </Data>
            </div>
            <style jsx>{`
              .contain {
                padding: 0 30px;
              }
              .fa {
                margin-right: 10px;
              }
              .row {
                margin: 0;
              }
              .dream-row {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
                border: 1px solid ${colors.grey[300]};
                border-radius: 10px;
                padding: 15px;
                margin: 5px 0;
              }
              .dream-footer {
                justify-content: space-between;
                width: 100%;
                padding-left: 15px;
              }
              .contributors {
                padding: 20px 0;
                flex-direction: row;
              }
              .contributors-mobile {
                padding: 10px 0 10px 10px;
                flex-direction: row;
                display: none;
              }
              .description {
                font-size: 1rem;
                line-height: 25px;
                padding-left: 15px;
                width: 100%;
              }
              .dream-title {
                font-size: 24px;
                line-height: 30px;
                margin-bottom: 10px;
                padding-left: 10px;
              }
              .content-col {
                justify-content: space-between;
                padding: 0;
                flex-direction: column;
                width: 100%;
              }
              .image {
                width: 150px;
                height: 150px;
                object-fit: cover;
              }
              .line {
                border-bottom: 1px solid ${colors.grey[300]};
                margin-bottom: 15px;
              }
              .bio {
                padding-bottom: 20px;
                font-size: 18px;
                line-height: initial;
                width: 80%;
              }
              .details-col {
                margin-left: 20px;
                justify-content: center;
              }
              .name {
                font-size: 1.8rem;
              }
              .location {
                color: ${colors.grey[800]};
                margin-top: 5px;
              }
              .contribute-button {
                padding: 0;
                align-self: flex-end;
              }
              .contribute-mobile-button {
                display: none;
                padding-right: 5px;
                align-self: center;
              }
              .profile-top {
                flex-direction: row;
                margin-top: 50px;
                padding-bottom: 20px;
              }
              .large-avatar {
                height: 100px;
                width: 100px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #e5e5e5;
              }
              .no-more-dream {
                font-size: 18px;
                padding: 10px;
                text-align: center;
                width: 100%;
              }
              @media (max-width: 576px) {
                .contain {
                  padding: 0 15px;
                }
                .large-avatar {
                  height: 80px;
                  width: 80px;
                }
                .line {
                  margin: 0 0 15px 0;
                  padding-bottom: 10px;
                }
                .name {
                  font-size: 1.2rem;
                }
                .location {
                  font-size: 0.895rem;
                }
                .bio {
                  width: 100%;
                  font-size: 0.895rem;
                  padding-bottom: 10px;
                }
                .profile-top {
                  margin: 20px 10px;
                  padding-bottom: 0;
                }
                .description {
                  display: none;
                }
                .dream-row {
                  padding: 0;
                  justify-content: start;
                }
                .image {
                  height: 120px;
                  width: 60px;
                  border-radius: 4px 0px 0px 4px !important;
                }
                .content-col {
                  padding: 10px 5px;
                  width: 100%;
                  min-height: 120px;
                }
                .dream-title {
                  font-size: 1rem;
                  line-height: 1.25;
                  margin-bottom: 0;
                }
                .dream-footer {
                  padding-left: 0;
                }
                .contributors {
                  display: none;
                }
                .contributors-mobile {
                  font-size: 0.8rem;
                  display: block;
                }
                .contribute-button {
                  display: none;
                }
                .contribute-mobile-button {
                  display: block;
                }
                .contribute-mobile-button .title {
                  font-weight: 700;
                }
              }
            `}</style>
          </>
        )
      }}
    </Data>
  )
}

const sendMail = async (self, user) => {
  if (!/@/g.test(self.state.sendProfile)) {
    window.alert('Invalid email')
    return null
  }
  self.setState({ loading: true })
  try {
    await firebase.functions().httpsCallable('sendProfile')({
      sendTo: self.state.sendProfile,
      user,
      url: window.location.href
    })
    self.setState({ sendProfile: '' })
    window.alert('Sent!')
  } catch (err) {
    window.alert('There was an error sending your message.')
    self.setState({ sendTo: '' })
    console.error(err)
  }
  self.setState({ loading: false })
}

const SendEmail = self => {
  let uid
  if (self.props.query.id) {
    uid = self.props.query.id
  } else if (self.context.currentUser.uid) {
    uid = self.context.currentUser.uid
  } else {
    return null
  }

  return (
    <Data query={db.collection('users').doc(uid)}>
      {({ data: user, loading }) => {
        return (
          <>
            <div className='contribute-row'>
              <Loading loading={self.state.loading} />
              <h1 className='c-title'>
                Share {user.fullName}’s dreams with someone
              </h1>
              <h3 className='c-subtitle'>
                We will send a message with a link to this dream. We don't
                encourage spam, so please send wisely!
              </h3>
              <div className='input-row'>
                <input
                  value={self.state.sendProfile}
                  onChange={e => self.setState({ sendProfile: e.target.value })}
                  placeholder='Enter phone or email'
                  className='input'
                />
                <div className='button'>
                  <Button
                    style={{
                      padding: '15px 40px'
                    }}
                    title='SEND'
                    onClick={() => sendMail(self, user)}
                  />
                </div>
              </div>
            </div>
            <div className='contribute-row-mobile'>
              <h4 className='c-title-mob'>
                Tap to share {user.fullName}’s dreams
              </h4>
              <p className='c-subtitle-mob'>givegratitude.co/{user.fullName}</p>
            </div>
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
              .c-title-mob {
                font-size: 1.2em;
                color: white;
                text-align: center;
                margin-bottom: 15px;
              }
              .c-subtitle-mob {
                font-size: 0.8em;
                color: white;
                width: 100%;
                text-align: center;
                font-weight: 400;
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
              @media (max-width: 576px) {
                .contribute-row {
                  display: none;
                }
                .contribute-row-mobile {
                  display: block;
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
      }}
    </Data>
  )
}

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sendProfile: '',
      pageCount: 1,
      loading: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.userProfile', {})
  }

  static getInitialProps = async ({ query, req }) => {
    // if the url is an `@<username>` profile, we direct the page to /profile
    // and get the user Id from the database and pass that Id to the
    // component to render normally.
    if (query.username) {
      let user
      try {
        const result = await db
          .collection('users')
          .where('username', '==', query.username)
          .get()
        // there should only ever be one
        result.forEach(doc => {
          user = doc
        })
      } catch (err) {
        console.error(err)
      }
      return {
        query: {
          id: user.id
        }
      }
    }
    return { query }
  };

  static contextType = Context;

  handleLoadmore = () => {
    const { pageCount } = this.state
    this.setState({ pageCount: pageCount + 1 })
  };
  // if there is an ID present, show that user's data
  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <Layout>{Content(this)}</Layout>
        {SendEmail(this)}
        <Footer />
      </Format>
    )
  }
}

export default Profile
