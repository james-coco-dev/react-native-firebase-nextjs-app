import React from 'react'
import { colors } from '@corcos/lib'
import { Data, Loading } from '@corcos/components'
import { withRouter } from 'next/router'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

import { Head, Navbar, Footer, Format, Button } from '../../../components'

import { db } from '../../../lib/firebase'
const { PRODUCTION_DREAM_DETAIL_URL } = require('../../../lib/constant')

class CreateConfirmation extends React.Component {
  componentDidMount () {
    window.analytics.page('pv.website.createDream.success')
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

  render () {
    return (
      <Format>
        <Head
          ogUrl={PRODUCTION_DREAM_DETAIL_URL + this.props.query.id}
          ogTitle={this.props.dream.title}
          ogDescription={`Contribute to ${this.props.user.fullName}'s Dream: ${
            this.props.dream.title
          }`}
          ogImage={this.props.dream.imageUrl}
        />
        <Navbar />
        <Data query={db.collection('dreams').doc(this.props.query.dreamId)}>
          {({ data: dream, loading }) => {
            if (loading) return <Loading loading />
            return (
              <Data query={db.collection('users').doc(dream.createdBy)}>
                {({ data: user }) => {
                  return (
                    <div className='contain row'>
                      <div className='card-container col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6'>
                        <img
                          src='/static/img/logos/congratulations.png'
                          alt='Gratitude'
                          className='congratulation'
                        />
                        <div className='subtitle'>
                          You’ve published your dream!
                        </div>
                        <div className='subtitle'>
                          Now let’s get your first contribution by letting
                          others know about your dream. Just a few shares can
                          make a huge impact.
                        </div>
                        <div className='row'>
                          <div
                            className='dream col-md-6 p-0'
                            onClick={() =>
                              window.open(
                                '/dreams?dreamId=' + this.props.query.dreamId,
                                '_blank'
                              )
                            }
                          >
                            <img
                              className='image rounded-top'
                              src={dream.imageUrl}
                            />
                            <div className='image-overlay rounded-top' />
                            <div className='content'>
                              <div className='dream-title'>{dream.title}</div>
                              <div className='profile'>
                                <img
                                  className='avatar'
                                  src={
                                    user.avatarUrl ||
                                    '/static/user-placeholder.png'
                                  }
                                />
                                <div>
                                  <div className='name'>{user.fullName}</div>
                                  <div className='location'>
                                    {user.location}
                                  </div>
                                </div>
                              </div>
                              <div className='footer'>
                                <div className='footer-email'>
                                  GIVEGRATITUDE.CO
                                </div>
                                Contribute to {user.fullName}'s Dream:{' '}
                                {dream.title}
                              </div>
                            </div>
                          </div>
                          <div className='share col-md-6'>
                            <FacebookShareButton
                              quote={`Contribute to ${user.fullName}'s Dream: ${
                                dream.title
                              }`}
                              url={
                                PRODUCTION_DREAM_DETAIL_URL +
                                this.props.query.dreamId
                              }
                            >
                              <Button
                                title='SHARE ON FACEBOOK'
                                style={{
                                  width: '100%',
                                  backgroundColor: '#284797',
                                  color: `white`
                                }}
                                onClick={() => {
                                  try {
                                    // NOTE:ARMAAN within a button that you want to track, you can use
                                    // window.analytics.track. You should also be able to add onClick to
                                    // just about any component that you want to track and it should track
                                    // them as well.
                                    // For example:
                                    window.analytics.track(
                                      'c.website.createDream.success.shareFacebook',
                                      {
                                        // dreamTitle: 'Build 10 Homes' ,
                                        // userFullName: 'Jane Doe' ,
                                        // userEmail: 'test@test.com'
                                        location: 'left',
                                        color: 'navy blue',
                                        text: 'Share on Facebook',
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
                            <div style={{ height: 15 }} />
                            <TwitterShareButton
                              title={`Contribute to ${user.fullName}'s Dream: ${
                                dream.title
                              }`}
                              url={
                                PRODUCTION_DREAM_DETAIL_URL +
                                this.props.query.dreamId
                              }
                            >
                              <Button
                                title='TWEET TO YOUR FOLLOWERS'
                                style={{
                                  width: '100%',
                                  backgroundColor: '#35aaf6',
                                  color: `white`
                                }}
                                onClick={() => {
                                  try {
                                    window.analytics.track(
                                      'c.website.createDream.success.shareTwitter',
                                      {
                                        // dreamTitle: 'Build 10 Homes' ,
                                        // userFullName: 'Jane Doe' ,
                                        // userEmail: 'test@test.com'
                                        location: 'left',
                                        color: 'sky blue',
                                        text: 'Tweet to your followers',
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
                            <div style={{ height: 15 }} />
                            <a
                              style={{ textDecoration: 'none' }}
                              href={`mailto:?subject=Contribute to ${
                                user.fullName
                              }'s Dream: ${
                                dream.title
                              }&body=${window.encodeURIComponent(
                                PRODUCTION_DREAM_DETAIL_URL +
                                  this.props.query.dreamId
                              )}`}
                            >
                              <Button
                                title='Send an email'
                                style={{
                                  width: '100%',
                                  backgroundColor: '#dbece5',
                                  color: `#23535D`,
                                  border: `0px solid #23535D`,
                                  boxShadow: `none`,
                                  marginBottom: `15px`
                                }}
                                onClick={() => {
                                  try {
                                    window.analytics.track(
                                      'c.website.createDream.success.shareEmail',
                                      {
                                        // dreamTitle: 'Build 10 Homes' ,
                                        // userFullName: 'Jane Doe' ,
                                        // userEmail: 'test@test.com'
                                        location: 'left',
                                        color: 'white',
                                        text: 'Send an email',
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
                            <Button
                              title='Copy the link'
                              style={{
                                width: '100%',
                                backgroundColor: '#dbece5',
                                color: `#23535D`,
                                border: `0px solid #23535D`,
                                boxShadow: `none`,
                                marginBottom: `15px`
                              }}
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    PRODUCTION_DREAM_DETAIL_URL +
                                      this.props.query.dreamId
                                  )
                                  window.alert('Copied to clipboard!')
                                  window.analytics.track(
                                    'c.website.createDream.success.shareCopyLink',
                                    {
                                      // dreamTitle: 'Build 10 Homes' ,
                                      // userFullName: 'Jane Doe' ,
                                      // userEmail: 'test@test.com'
                                      location: 'left',
                                      color: 'white',
                                      text: 'Copy the link',
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
                        <div className='continue'>
                          <div
                            className='continue-text'
                            onClick={() =>
                              this.props.router.push({
                                pathname: '/dreams',
                                query: { dreamId: this.props.query.dreamId }
                              })
                            }
                          >
                            Skip for now
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </Data>
            )
          }}
        </Data>
        <Footer />
        <style jsx>{`
          .row {
            margin: 0;
          }
          .contain {
            align-items: center;
            justify-content: center;
            margin: 40px 15px 80px;
          }
          .card-container {
            border-radius: 5px;
            border: 1px solid ${colors.grey[300]};
            padding: 30px 60px 90px;
          }
          .congratulation {
            width: 70%;
            align-self: center;
            margin: 10px 0px 40px 0px;
          }
          .subtitle {
            margin-bottom: 20px;
            line-height: initial;
            font-size: 18px;
          }
          .dream {
            height: 300px;
            width: 100%;
            border: 1px solid ${colors.grey[300]};
            border-top: 0;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
          }
          .share {
            padding: 0 10px;
          }
          .image {
            height: 200px;
            object-fit: cover;
            position: absolute;
            width: 100%;
          }
          .image-overlay {
            position: absolute;
            height: 200px;
            background-color: black;
            opacity: 0.5;
            width: 100%;
          }
          .content {
            z-index: 100;
            padding: 20px;
            height: 200px;
            justify-content: space-between;
          }
          .avatar {
            height: 50px;
            width: 50px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 15px;
            border: 3px solid #e5e5e5;
          }
          .profile {
            flex-direction: row;
            align-items: center;
          }
          .name {
            color: white;
            margin-bottom: 3px;
          }
          .location {
            color: white;
            font-size: 12px;
          }
          .continue-text {
            color: ${colors.grey[600]};
            text-decoration: underline;
            cursor: pointer;
          }
          .dream-title {
            color: white;
            font-weight: 700;
            font-size: 1.125rem;
            line-height: 1.25;
          }
          .continue {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: #fafbfd;
            justify-content: center;
            align-items: center;
            border-top: 1px solid ${colors.grey[300]};
          }
          .footer-email {
            margin-bottom: 10px;
            color: ${colors.grey[500]};
            font-size: 0.85rem;
          }
          .footer {
            position: absolute;
            height: auto;
            bottom: 0px;
            padding: 10px 10px 10px 0;
            justify-content: top;
            line-height: 1.25;
            font-size: 0.85rem;
          }
          @media (max-width: 576px) {
            .contain {
              margin-bottom: 20px;
            }
            .card-container {
              padding: 20px 10px 70px;
            }
            .subtitle,
            .footer {
              font-size: 14px;
            }
          }
          @media (max-width: 768px) {
            .share {
              padding: 0;
            }
          }
        `}</style>
      </Format>
    )
  }
}

export default withRouter(CreateConfirmation)
