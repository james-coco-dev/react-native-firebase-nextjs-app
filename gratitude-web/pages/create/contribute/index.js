import React from 'react'
import { colors } from '@corcos/lib'
import { Loading } from '@corcos/components'
import { withRouter } from 'next/router'
import _ from 'lodash'
import Link from 'next/link'

import {
  Head,
  Navbar,
  Format,
  CreateDreamHeader,
  Layout,
  Button,
  Footer,
  Search
} from '../../../components'

import validateDreamAndRedirect from '../../../lib/validateDreamAndRedirect'
import Context from '../../../lib/context'
import { db } from '../../../lib/firebase'

const Method = props => {
  return (
    <div className='button' onClick={props.onClick}>
      {props.title}

      <style jsx>{`
        .button {
          background-color: ${props.isActive ? '#23535D' : 'white'};
          border: 1px solid #23535d;
          border-radius: 5px;
          color: ${props.isActive ? 'white' : '#23535D'};
          flex: 1;
          margin: 5px;
          cursor: pointer;
          justify-content: center;
          align-items: center;
          padding-top: 15px;
          padding-bottom: 15px;
          transition: all 0.3s ease;
          font-weight: 700;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
        }
        .button:hover {
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}

const charityNavigatorUrl = query =>
  `https://api.data.charitynavigator.org/v2/organizations?app_key=96e800992bb5dd1bc37d78ebea8aaecd&app_id=ecec217f&search=${query}&searchType=NAME_ONLY&sort=RELEVANCE:DESC&pageSize=10`

const runQuery = _.debounce(async (v, self) => {
  self.setState({ loading: true })
  let organizations
  try {
    const response = await window.fetch(
      charityNavigatorUrl(encodeURIComponent(v))
    )
    const result = await response.json()
    if (result.length) {
      organizations = result
    } else {
      organizations = []
    }
  } catch (err) {
    console.error(err)
    self.setState({ loading: false })
  }
  self.setState({
    organizations,
    loading: false
  })
}, 250)

class CreateDreamContribute extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      method: '',
      query: '',
      loading: false,
      organizations: [],
      selected: null,
      isClick: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.createDream.contribute')
    validateDreamAndRedirect(this.context.dream, this.props.router.push)
    if (this.props.store.currentUser.uid === undefined) {
      this.props.router.push('/login')
    }
  }

  static contextType = Context;

  _handleSubmit = async store => {
    if (this.state.isClick) return null
    await this.setState({ isClick: true, loading: true })

    let dream
    if (!this.state.method) {
      window.alert('You must select a contribution method')
      await this.setState({ isClick: false, loading: false })
      return null
    }
    if (this.state.method === 'donation') {
      if (!this.state.selected) {
        // if the method is donation and the user has not selected a charity, error
        window.alert('You must select a charity. Search for one below.')
        await this.setState({ isClick: false, loading: false })
        return null
      }
    }

    const params = {
      ...store.dream,
      method: this.state.method
    }
    if (this.state.method === 'donation') {
      params.charity = this.state.selected
    }
    try {
      dream = await db.collection('dreams').add({
        ...params,
        createdBy: store.currentUser.uid,
        createdAt: new Date()
      })
      this.props.router.push({
        pathname: '/create/confirmation',
        query: { dreamId: dream.id }
      })
    } catch (err) {
      console.error(err)
      await this.setState({ isClick: false, loading: false })
    }
  };

  handleChange = v => {
    this.setState({ query: v })
    runQuery(v, this)
  };

  render () {
    const isSelectMethod = this.state.method !== ''
    return (
      <Format>
        <Head />
        <Loading loading={this.state.loading} />
        <Navbar />
        <CreateDreamHeader index={3} />
        <Layout>
          <div className='row mx-2'>
            <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
              <h1 className='title'>How should people contribute?</h1>
              <div className='subtitle'>
                We currently have three ways for others to contribute. Choose
                the one which you'd like people to use for this dream.
              </div>
              <div className='button-row'>
                <Method
                  isActive={this.state.method === 'money'}
                  title='Money'
                  onClick={() => this.setState({ method: 'money' })}
                />
                <Method
                  isActive={this.state.method === 'donation'}
                  title='Donation'
                  onClick={() => this.setState({ method: 'donation' })}
                />
                <Method
                  isActive={this.state.method === 'message'}
                  title='Message'
                  onClick={() => this.setState({ method: 'message' })}
                />
              </div>
              {this.state.method === 'money' && (
                <div className='subtitle'>
                  Your contributors will be able to enter any amount which they
                  wish to send.
                </div>
              )}
              {this.state.method === 'message' && (
                <div className='subtitle'>
                  Your contributors will be able to send you messages with an
                  optional photo/video.
                </div>
              )}
              {this.state.method === 'donation' && (
                <>
                  <div className='subtitle-paypal'>
                    We use the &nbsp;
                    <Link href='/paypal'>
                      <a>PayPal Giving Fund</a>
                    </Link>
                    <p>&nbsp;to distribute</p>
                    <p>&nbsp;donations.</p>
                  </div>
                  <div style={{ height: 30 }} />
                  {this.state.selected ? (
                    <>
                      <div style={{ marginBottom: 15, flexDirection: 'row' }}>
                        <div style={{ fontWeight: 500 }}>Selected Charity:</div>
                        &nbsp;{this.state.selected.charityName}
                      </div>
                      <div
                        style={{ cursor: 'pointer', color: colors.blue[500] }}
                        onClick={() => this.setState({ selected: null })}
                      >
                        Change
                      </div>
                    </>
                  ) : (
                    <div className='input'>
                      <Search
                        value={this.state.query}
                        onChange={this.handleChange}
                        placeholder='Search for any charity name or keyword'
                      />
                      {this.state.organizations.map(o => (
                        <div
                          className='organization'
                          key={o.ein}
                          onClick={() =>
                            this.setState({
                              selected: o,
                              organizations: [],
                              query: ''
                            })
                          }
                        >
                          {o.charityName}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              <Context.Consumer>
                {store => (
                  <div className='row button-container'>
                    <div className='col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2'>
                      <Button
                        title='PUBLISH'
                        disabled={!isSelectMethod && true}
                        color={isSelectMethod ? '#23535D' : '#DFDFDF'}
                        onClick={() => this._handleSubmit(store)}
                      />
                    </div>
                  </div>
                )}
              </Context.Consumer>
              <div className='prompt-tips'>
                <h6>What is messages?</h6>
                <p>
                  We've created "message" as a way for you to receive
                  contributions in ways other than receiving money or donations.
                </p>
                <p>
                  For example, if you want people to share your music with their
                  friends, money or donations don't fit the mold. Have people
                  take action and leave a message for you when they've done the
                  deed.
                </p>
              </div>
            </div>
          </div>

          <style jsx>{`
            .organization {
              cursor: pointer;
              padding: 20px;
              border: 1px solid ${colors.grey[300]};
              margin: 5px;
              flex: 1;
              transition: all 0.1s ease;
            }
            .organization:hover {
              background-color: ${colors.grey[100]};
            }
            .button-row {
              margin-top: 30px;
              width: 100%;
              flex-direction: row;
            }
            .button-container {
              margin-top: 50px;
            }
            .title {
              margin-top: 60px;
              font-size: 2.5rem;
            }
            .subtitle {
              padding-top: 30px;
              line-height: initial;
            }
            .subtitle-paypal {
              flex-flow: wrap;
              padding: 20px 0;
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
              .button-container {
                margin-top: 20px;
              }
              .button-row {
                margin-top: 0;
              }
              .subtitle-paypal {
                font-size: 14px;
                padding-top: 20px;
              }
              .subtitle-paypal a,
              p {
                font-size: 14px;
              }
            }
          `}</style>
        </Layout>
        <Footer />
      </Format>
    )
  }
}

export default withRouter(CreateDreamContribute)
