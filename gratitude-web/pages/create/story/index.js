import React from 'react'
import { colors, getFileAsBinary, uploadImage } from '@corcos/lib'
import { Data, Loading } from '@corcos/components'
import { withRouter } from 'next/router'
import Dropzone from 'react-dropzone'

import {
  Head,
  Navbar,
  Format,
  Modal,
  Layout,
  Input,
  CreateDreamHeader,
  Textarea,
  Button,
  Footer,
  Search
} from '../../../components'

import validateDreamAndRedirect from '../../../lib/validateDreamAndRedirect'
import Context from '../../../lib/context'
import { db, firebase } from '../../../lib/firebase'

// takes in a string of hashtags and separates them by comma
const processHashtags = tags => {
  return tags
    .split(',')
    .map(v => v.trim())
    .reduce((acc, v) => {
      return {
        [v]: true,
        ...acc
      }
    }, {})
}

const submit = (self, store) => {
  self.setState({ loading: true })
  // if the user has an incomplete profile, prompt the user to complete the profile here.
  store.set('dream', {
    ...store.dream,
    story: self.state.story,
    hashtags: processHashtags(self.state.hashtags)
  })
  self.props.router.push('/create/photo')
  self.setState({ loading: false })
}

const CompleteProfileModal = (self, user, store) => {
  return (
    <Modal isOpen>
      <div className='content'>
        <Loading loading={self.state.loading} />
        <h1 className='title'>Complete your profile</h1>
        <div className='label'>PHOTO</div>
        <div className='photo-row'>
          {user.avatarUrl || self.state.image ? (
            <img className='avatar' src={user.avatarUrl || self.state.image} />
          ) : (
            <Dropzone onDrop={self.onDrop}>
              {({ getRootProps, getInputProps, isDragActive }) => {
                const inputProps = getInputProps()
                const rootProps = getRootProps()
                return (
                  <div
                    {...rootProps}
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                  >
                    <input {...inputProps} />+
                  </div>
                )
              }}
            </Dropzone>
          )}
          <div className='photo-text'>Upload a photo</div>
        </div>
        <div style={{ height: 20 }} />
        <div className='label'>PHONE</div>
        <div className='subtitle'>
          We’ll notify you when someone contributes to your dream.
        </div>
        <div style={{ height: 10 }} />
        <Search
          tag={'+1'}
          placeholder='Phone'
          onChange={v => self.setState({ phoneNumber: v })}
          value={self.state.phoneNumber}
        />
        <div style={{ height: 20 }} />
        <div className='label'>LOCATION</div>
        <Input
          placeholder='City, State'
          onChange={v => self.setState({ location: v })}
          value={self.state.location}
        />
        <div style={{ height: 20 }} />
        <div className='label'>ABOUT ME</div>
        <Textarea
          style={{ height: 80 }}
          value={self.state.aboutMe}
          onChange={v => self.setState({ aboutMe: v })}
        />
        <div style={{ height: 20 }} />
        <Button
          title='Continue'
          onClick={async () => {
            await self.setState({ loading: true })
            try {
              // update user profile
              await db
                .collection('users')
                .doc(store.currentUser.uid)
                .set(
                  {
                    phoneNumber: self.state.phoneNumber,
                    location: self.state.location,
                    aboutMe: self.state.aboutMe,
                    avatarUrl: self.state.image
                  },
                  { merge: true }
                )
              // then submit
              submit(self, store)
            } catch (err) {
              console.error(err)
            }
            await self.setState({ loading: false })
          }}
        />
        <div style={{ height: 20 }} />
        <div className='skip' onClick={() => submit(self, store)}>
          Skip for now
        </div>
      </div>

      <style jsx>{`
        .skip {
          text-align: center;
          color: ${colors.grey[400]};
          text-decoration: underline;
          cursor: pointer;
          font-size: 13px;
        }
        .subtitle {
          font-size: 14px;
          line-height: initial;
        }
        .active {
          background-color: ${colors.grey[100]};
        }
        .label {
          margin: 10px 0 5px 0;
          font-size: 13px;
          font-weight: 700;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
        }
        .photo-row {
          flex-direction: row;
          align-items: center;
        }
        .photo-text {
          margin-left: 15px;
        }
        .avatar {
          height: 70px;
          width: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e5e5e5;
        }
        .dropzone {
          transition: all 0.3s ease;
          height: 70px;
          width: 70px;
          border: 1px solid ${colors.grey[300]};
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          color: ${colors.grey[300]};
          cursor: pointer;
        }
        .title {
          text-align: center;
          margin-bottom: 30px;
        }
        .content {
          padding: 30px 20px;
          background-color: white;
          border-radius: 5px;
          width: 400px;
        }
      `}</style>
    </Modal>
  )
}

class TellStory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      story: '',
      hashtags: '',
      completeProfileModalIsOpen: false,
      image: '',
      phoneNumber: '',
      location: '',
      aboutMe: '',
      loading: false,
      mainValidation: false,
      profileValidation: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.createDream.story')
    validateDreamAndRedirect(this.context.dream, this.props.router.push)
    if (this.props.store.currentUser.uid === undefined) {
      this.props.router.push('/login')
    }
  }

  static contextType = Context;

  _handleSubmit = async (store, user) => {
    // if we do not have an image, phone number, or location for the user, prompt the user to add them now.
    if (!user.avatarUrl || !user.phoneNumber || !user.location) {
      this.setState({ completeProfileModalIsOpen: true })
      return null
    }

    if (!this.state.story || !this.state.hashtags) {
      this.setState({ mainValidation: true })
      return null
    }
    this.setState({ mainValidation: false })
    submit(this, store)
  };

  onDrop = async (acceptedFiles, rejectedFiles) => {
    await this.setState({ loading: true })
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

    await this.setState({ image: url, loading: false })
  };

  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <CreateDreamHeader index={1} />
        <Layout>
          <div className='row mx-2'>
            <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
              <Loading loading={this.state.loading} />
              <h1 className='title'>Tell us your story</h1>
              <div className='subtitle'>
                Sometimes a few words explaining why you want this helps set the
                right tone.
              </div>
              <Context.Consumer>
                {store => {
                  if (!store.currentUser.uid) return null
                  return (
                    <Data
                      query={db.collection('users').doc(store.currentUser.uid)}
                    >
                      {({ data: user, loading }) => {
                        return (
                          <>
                            {this.state.completeProfileModalIsOpen &&
                              CompleteProfileModal(this, user, store)}
                            <Textarea
                              value={this.state.story}
                              placeholder='Type something here...'
                              onChange={v => this.setState({ story: v })}
                              validation={this.state.mainValidation}
                              validationText='Your dream must have a story.'
                            />
                            <div className='subtitle'>
                              Enter some relevant hashtags so others can learn
                              about your dream
                            </div>
                            <Input
                              value={this.state.hashtags}
                              onChange={v => this.setState({ hashtags: v })}
                              placeholder='What is your dream?'
                              validation={this.state.mainValidation}
                              validationText='Your dream must have hashtags.'
                            />
                            <div className='sub'>
                              Separate each hashtag with a comma. You do not
                              need to use the # symbol.
                            </div>
                            <div className='row mt-2'>
                              <div className='col-sm-4 offset-sm-8 col-md-3 offset-md-9'>
                                <Button
                                  title='CONTINUE'
                                  onClick={() =>
                                    this._handleSubmit(store, user)
                                  }
                                />
                              </div>
                            </div>
                          </>
                        )
                      }}
                    </Data>
                  )
                }}
              </Context.Consumer>
              <div className='prompt-tips'>
                <h6>Be clear in what you're asking for</h6>
                <p>
                  Readers are most likely to contribute if they can understand
                  exactly you are asking for and how to best support you.
                </p>
                <br />
                <h6>Explain why this is important to you</h6>
                <p>
                  Explain why this dream needs to come true for you. If it does,
                  what are you going to do? Even if it doesn't, what will that
                  mean to you.
                </p>
                <br />
                <h6>Make it personal</h6>
                <p>
                  Readers are more likely to contribute and support your dream
                  if it’s meaningful.
                </p>
              </div>
            </div>
          </div>

          <style jsx>{`
            .sub {
              font-size: 14px;
              padding: 5px 0;
            }
            .title {
              margin-top: 60px;
              font-size: 2.5rem;
            }
            .subtitle {
              padding: 30px 0;
              line-height: 1.5;
            }
            .prompt-tips {
              color: ${colors.grey[600]};
              text-align: left;
              padding: 20px;
              line-height: 1.5;
              margin: 70px 0;
              background-color: #fafbfd;
              border: 1px solid #dee2e6 !important;
              border-radius: 0.25rem !important;
            }
            .prompt-tips p {
              margin-bottom: 0.5rem;
            }
            @media (max-width: 576px) {
              .title {
                font-size: 24px;
                margin-top: 40px;
              }
              .subtitle {
                padding: 20px 0;
                font-size: 14px;
              }
              .prompt-tips {
                margin: 20px 0;
              }
              .sub {
                font-size: 12px;
              }
            }
          `}</style>
        </Layout>
        <Footer />
      </Format>
    )
  }
}

export default withRouter(TellStory)
