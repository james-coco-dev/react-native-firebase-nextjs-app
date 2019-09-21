import React from 'react'
import { colors } from '@corcos/lib'
import { Data, Loading } from '@corcos/components'
import moment from 'moment'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import _ from 'lodash'
import {
  Head,
  Navbar,
  Format,
  Layout,
  Button,
  Modal,
  Footer,
  Search
} from '../../components'

import { db } from '../../lib/firebase'
import { index } from '../../lib/algolia'
const { PRODUCTION_SITE_URL } = require('../../lib/constant')

const formatStory = story => {
  if (story !== undefined) {
    if (story.length > 120) {
      return `${story.slice(0, 120)}...`
    }
  }
  return story
}
const formatName = name => {
  if (name !== undefined) {
    if (name.length > 15) {
      return `${name.slice(0, 15)}...`
    }
  }
  return name
}

const OnboardingModal = self => {
  if (!self.state.onboardingModalIsOpen) return null
  return (
    <Modal close={() => self.setState({ onboardingModalIsOpen: false })}>
      <div className='content-1'>
        <h1 className='title-1'>Welcome to Gratitude</h1>
        <div className='text-1'>
          Thanks for joining! Whether you came here to publish a dream,
          contribute to one, or just look around, we're happy to have you. We
          want to pursue a world where expressing gratitude is part of everyday
          life. We want to create community and connection by making acts of
          kindness tangible for anyone.
        </div>
        <div className='text-1'>
          So... what everyone is dying to know is what you want! Start by
          creating a dream and sharing it with your friends and family. That
          way, they can contribute to you whenever they're thinking of you.
        </div>
        <Link href='/create'>
          <Button title='CREATE YOUR FIRST DREAM' onClick={() => {}} />
        </Link>
        <div
          className='skip-1'
          onClick={() => self.setState({ onboardingModalIsOpen: false })}
        >
          Skip for now
        </div>

        <style jsx>{`
          .title-1 {
            font-size: 24px;
            padding-bottom: 20px;
            padding-top: 20px;
          }
          .text-1 {
            padding-bottom: 20px;
            line-height: 1.5;
          }
          .text-2 {
            padding-bottom: 90px;
          }
          .content-1 {
            background-color: white;
            padding: 20px;
            width: 400px;
            border-radius: 4px;
          }
          .skip-1 {
            font-size: 13px;
            margin-bottom: 20px;
            cursor: pointer;
            color: #9da5af;
            text-decoration: underline;
            text-align: center;
            margin-top: 20px;
          }
        `}</style>
      </div>
    </Modal>
  )
}

const Dream = (d, i, self) => {
  return (
    <div
      className='contain'
      key={'dream' + i}
      onClick={() => window.open('/dreams?dreamId=' + i, '_blank')}
    >
      {self.state.searchKey !== '' ? (
        <div className='content'>
          <h3
            className='title'
            dangerouslySetInnerHTML={{ __html: d._highlightResult.title.value }}
          />
          <div className='description'>{formatStory(d.story)}</div>
          <div className='details row'>
            <div className='person'>
              <img
                src={d.avatarUrl || '/static/user-placeholder.png'}
                className='avatar'
              />
              <div
                className='name'
                dangerouslySetInnerHTML={{
                  __html: d._highlightResult.author.value
                }}
              />
              <div
                className='name-mob'
                dangerouslySetInnerHTML={{
                  __html: d._highlightResult.author.value
                }}
              />
            </div>
            <div className='contributors'>
              <span className='fa fa-user' />
              {d.contributionCount || 0}
              <p className='contributors-label'> &nbsp;contributors </p>
            </div>
          </div>
        </div>
      ) : (
        <div className='content'>
          <Data query={db.collection('users').doc(d.createdBy)}>
            {({ data: user }) => {
              return (
                <>
                  <h3 className='title'>{d.title}</h3>
                  <div className='description'>{formatStory(d.story)}</div>
                  <div className='details row'>
                    <div className='person'>
                      <img
                        src={user.avatarUrl || '/static/user-placeholder.png'}
                        className='avatar'
                      />
                      <div className='name'>{user.fullName}</div>
                      <div className='name-mob'>
                        {formatName(user.fullName)}
                      </div>
                    </div>
                    <div className='contributors'>
                      <span className='fa fa-user' />
                      {d.contributionCount || 0}
                      <p className='contributors-label'> &nbsp;contributors </p>
                    </div>
                  </div>
                </>
              )
            }}
          </Data>
        </div>
      )}
      <div className='flex-row-reverse'>
        <img src={d.imageUrl} className='image rounded' />
      </div>

      <style jsx>{`
        .row {
          margin: 0;
        }
        .contain {
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          cursor: pointer;
          border-radius: 5px;
          padding: 20px;
          border: 1px solid ${colors.grey[200]};
          margin-bottom: 20px;
          transition: all 0.1s ease;
        }
        .contain:hover {
          background-color: rgba(219, 236, 229, 0.5);
          border: 1px solid rgba(35, 83, 93, 0.25);
        }
        .image {
          object-fit: cover;
          height: 160px;
          width: 160px;
          margin-left: 15px;
        }
        .title {
          font-size: 24px;
          line-height: 1.3em;
          margin-bottom: 10px;
          flex-direction: row;
          display: block;
        }
        .description {
          font-size: 16px;
          line-height: 1.5em;
          margin-bottom: 10px;
        }
        .details {
          width: 100%;
          margin-top: 15px;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
        }
        .fa-user {
          margin-right: 10px;
        }
        .person {
          flex-direction: row;
          align-items: center;
        }
        .avatar {
          border: 2px solid #e5e5e5;
          margin-right: 10px;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          object-fit: cover;
        }
        .contributors {
          flex-direction: row;
        }
        .name-mob {
          display: none;
          flex-direction: row;
        }
        .name {
          flex-direction: row;
          display: block;
        }
        .content {
          justify-content: space-between;
          padding: 0;
          flex-direction: column;
          width: 100%;
        }
        @media (max-width: 576px) {
          .contain {
            padding: 0;
          }
          .title {
            font-size: 16px;
            margin-bottom: 0;
          }
          .description {
            font-size: 0.795rem;
            line-height: 1rem;
            max-height: 30px;
            margin-top: 10px;
            overflow: hidden;
          }
          .image {
            min-height: 120px;
            width: 100px;
            margin-left: 0;
            border-radius: 0px 4px 4px 0px !important;
          }
          .content {
            padding: 10px;
            min-height: 100px;
          }
          .fa-user {
            margin-right: 5px;
            font-size: 0.895rem;
          }
          .contributors {
            font-size: 0.895rem;
          }
          .avatar {
            margin-right: 5px;
            height: 25px;
            width: 25px;
          }
          .name-mob {
            font-size: 13px;
            display: block;
          }
          .contributors-label,
          .name {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

const Contributor = (d, i) => {
  return (
    <div className='contain' key={'contributor' + i}>
      <img
        src={d.avatarUrl || '/static/user-placeholder.png'}
        className='icon'
      />
      <div className='contributor-content'>
        <div className='name'>{d.name || 'Anomymous'}</div>
        <div className='timestamp'>
          {moment(d.createdAt.seconds * 1000).fromNow()}
        </div>
      </div>

      <style jsx>{`
        .timestamp {
          margin-top: 5px;
          color: #9da5af;
          font-size: 13px;
        }
        .icon {
          flex-shrink: 0;
          height: 60px;
          width: 60px;
          border-radius: 50%;
          margin-right: 15px;
          border: 3px solid #e5e5e5;
        }
        .contain {
          flex-direction: row;
          border: 1px solid ${colors.grey[300]};
          border-bottom: none;
          padding: 15px;
          overflow: hidden;
        }
        .contributor-content {
          justify-content: center;
        }
        .contain:first-child {
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
        }
        .contain:last-child {
          border-bottom: 1px solid ${colors.grey[300]};
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        .name {
          font-weight: 700;
        }
        @media (max-width: 576px) {
          .name {
            font-size: 14px;
          }
          .timestamp {
            font-size: 12px;
          }
          .contain {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  )
}

const Dreamgroup = (pageCount, self, maxLength) => {
  return (
    <Data
      query={db
        .collection('dreams')
        .orderBy('createdAt', 'desc')
        .limit(pageCount * 5)}
    >
      {({ data, loading }) => {
        if (loading) return <Loading loading />
        const dreams = Object.keys(data).map(key => data[key])
        return (
          <>
            {dreams.map(d => Dream(d, d.id, self))}
            {maxLength === dreams.length ? (
              <h3 className='no-more-dream'>No more dreams to display</h3>
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
            <style jsx>{`
              .no-more-dream {
                font-size: 18px;
                padding: 10px;
                text-align: center;
                width: 100%;
              }
            `}</style>
          </>
        )
      }}
    </Data>
  )
}

const SearchDreamgroup = self => {
  return self.state.result.map(c => Dream(c, c.objectID, self))
}

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      onboardingModalIsOpen: props.query.new,
      searchKey: '',
      result: [],
      pageCount: 1
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.discover')
  }

  static getInitialProps = async ({ query }) => {
    return { query }
  };

  handleLoadmore = () => {
    const { pageCount } = this.state
    this.setState({ pageCount: pageCount + 1 })
  };

  handleSearchKey = data => {
    this.setState({ searchKey: data })
    if (data !== '') {
      const query = {
        query: data,
        restrictSearchableAttributes: ['author', 'title', 'hashtags', 'story']
      }
      index
        .search(query)
        .then(res => {
          this.setState({ result: res.hits })
          console.log(res.hits)
        })
        .catch(err => console.error(err))
    }
  };

  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        {OnboardingModal(this)}
        <Layout>
          <div className='contain row'>
            <div className='col-sm-12 col-md-7 col-lg-8 pb-3'>
              <div className='search-row row'>
                <div className='col-sm-12 col-md-7 p-0'>
                  <h1 className='title'>Discover Dreams</h1>
                </div>
                <div className='col-sm-12 col-md-5 p-0'>
                  <Search
                    placeholder='Search'
                    onChange={_.debounce(this.handleSearchKey, 1000)}
                  />
                </div>
              </div>
              {this.state.searchKey !== '' ? (
                <>
                  {SearchDreamgroup(this)}
                  <h3 className='no-more-dream'>No more search results</h3>
                </>
              ) : (
                <Data query={db.collection('dreams')}>
                  {({ data, loading }) => {
                    const dreams = Object.keys(data).map(key => data[key])
                    return Dreamgroup(
                      this.state.pageCount,
                      this,
                      dreams.length
                    )
                  }}
                </Data>
              )}
            </div>
            <div className='col-sm-12 col-md-5 col-lg-4'>
              <h3 className='recent'>Recent contributions</h3>
              <div>
                <Data
                  query={db
                    .collection('contributions')
                    .orderBy('createdAt', 'desc')
                    .limit(5)}
                >
                  {({ data: recent, loading }) => {
                    const iterable = Object.keys(recent).map(
                      key => recent[key]
                    )
                    return iterable.length === 0 ? (
                      <h4 className='no-contributor'>No Contributors</h4>
                    ) : (
                      iterable.map(c => Contributor(c, c.id))
                    )
                  }}
                </Data>
              </div>
              <h3 className='follow-us'>Invite to Gratitude</h3>
              <div className='contributors-column'>
                <FacebookShareButton
                  quote={`Contribute to someone's dream at Gratitude`}
                  url={PRODUCTION_SITE_URL}
                >
                  <Button
                    title='INVITE ON FACEBOOK'
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
                          'c.website.discover.inviteFacebook',
                          {
                            // dreamTitle: 'Build 10 Homes' ,
                            // userFullName: 'Jane Doe' ,
                            // userEmail: 'test@test.com'
                            location: 'right',
                            color: 'navy blue',
                            text: 'Invite on Facebook',
                            CTA: 'Facebook',
                            category: 'Invites',
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
                  title={`Contribute to someone's dream at Gratitude`}
                  url={PRODUCTION_SITE_URL}
                  style={{ border: 0 }}
                >
                  <Button
                    title='INVITE ON TWITTER'
                    style={{
                      width: '100%',
                      backgroundColor: '#35aaf6',
                      color: `white`
                    }}
                    onClick={() => {
                      try {
                        window.analytics.track(
                          'c.website.discover.inviteTwitter',
                          {
                            // dreamTitle: 'Build 10 Homes' ,
                            // userFullName: 'Jane Doe' ,
                            // userEmail: 'test@test.com'
                            location: 'right',
                            color: 'sky blue',
                            text: 'Invite on Twitter',
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
            </div>
          </div>
        </Layout>
        <Footer />

        <style jsx>{`
          .row {
            margin: 0;
          }
          .contain {
            margin-top: 30px;
            margin-bottom: 80px;
          }
          .search-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 20px;
          }
          .title {
            font-size: 2.5rem;
            margin: 5px 0;
          }
          .recent {
            padding-bottom: 10px;
            font-size: 20px;
          }
          .follow-us {
            padding: 30px 0 10px 0;
            font-size: 20px;
          }
          .no-contributor {
            padding: 15px;
            text-align: center;
            font-size: 14px;
            border: 1px solid #e0e0e0;
            width: 100%;
            border-radius: 5px;
          }
          .contributors-column {
            border: 1px solid #e0e0e0;
            padding: 15px;
            overflow: hidden;
            border-radius: 5px;
          }
          .no-more-dream {
            font-size: 18px;
            padding: 10px;
            text-align: center;
            width: 100%;
          }
          @media (max-width: 576px) {
            .title {
              font-size: 1.25rem;
              margin: 10px 0 10px 0;
            }
            .contain {
              margin: 0 0 20px;
            }
            .recent,
            .follow-us {
              font-size: 16px;
            }
          }
        `}</style>
      </Format>
    )
  }
}

export default withRouter(Dashboard)
