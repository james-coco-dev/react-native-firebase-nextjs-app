import React from 'react'
import { colors } from '@corcos/lib'
import { Data, Loading } from '@corcos/components'
import { withRouter } from 'next/router'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

import { Head, Navbar, Footer, Format, Button } from '../../../components'

import { db } from '../../../lib/firebase'
const { PRODUCTION_DREAM_DETAIL_URL } = require('../../../lib/constant')

class DreamContributionThankYou extends React.Component {
  componentDidMount () {
    window.analytics.page('pv.website.userDream.contributionSent')
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
                          src='/static/img/logos/thankyou.png'
                          alt='Gratitude'
                          className='congratulation'
                        />
                        <div className='subtitle'>
                          {user.fullName} will be receiving your contribution
                          soon!
                        </div>
                        <div className='subtitle'>
                          You can help {user.fullName} achieve his dreams even
                          faster by sharing your contribution with your friends.
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
                                <div className='footer-email'>{user.email}</div>
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
                                onClick={() => {}}
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
                                onClick={() => {}}
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
                                  backgroundColor: 'white',
                                  color: `#757575`,
                                  border: `2px solid #e0e0e0`,
                                  boxShadow: `none`,
                                  marginBottom: `15px`
                                }}
                                onClick={() => {}}
                              />
                            </a>
                            <Button
                              title='Copy the link'
                              style={{
                                width: '100%',
                                backgroundColor: 'white',
                                color: `#757575`,
                                border: `2px solid #e0e0e0`,
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
            width: 60%;
            align-self: center;
            margin-bottom: 20px;
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
            font-weight: 500;
            font-size: 20px;
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
            color: ${colors.grey[400]};
          }
          .footer {
            position: absolute;
            height: 100px;
            bottom: 0px;
            padding: 10px 10px 10px 0;
            justify-content: center;
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

export default withRouter(DreamContributionThankYou)
