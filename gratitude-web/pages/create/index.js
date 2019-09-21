import React from 'react'
import { colors } from '@corcos/lib'
import { withRouter } from 'next/router'
import { Loading } from '@corcos/components'

import {
  Head,
  Navbar,
  CreateDreamHeader,
  Format,
  Layout,
  Input,
  Button,
  Footer
} from '../../components'

import Context from '../../lib/context'

class CreateDream extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      loading: false,
      validation: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.createDream.name')
    if (this.props.store.currentUser.uid === undefined) {
      this.props.router.push('/login')
    }
  }

  static contextType = Context;

  _handleSubmit = async store => {
    if (!this.state.title) {
      this.setState({ validation: true })
      return null
    }
    await this.setState({ loading: true, validation: false })
    store.set('dream', { ...store.dream, title: this.state.title })
    this.props.router.push('/create/story')
    await this.setState({ loading: false })
  };

  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <CreateDreamHeader index={0} />
        <Layout>
          <div className='row mx-2'>
            <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
              <Loading loading={this.state.loading} />
              <h1 className='title'>Name your dream</h1>
              <div className='subtitle'>
                This should be a clear statement of what you're looking for. We
                have some tips below.
              </div>
              <Context.Consumer>
                {store => (
                  <>
                    <Input
                      placeholder='What is your dream?'
                      onChange={v => this.setState({ title: v })}
                      value={this.state.title}
                      validation={this.state.validation}
                      validationText='Your dream must have a title.'
                    />
                    <div className='row mt-2'>
                      <div className='col-sm-4 offset-sm-8 col-md-3 offset-md-9'>
                        <Button
                          title='CONTINUE'
                          onClick={() => this._handleSubmit(store)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </Context.Consumer>
              <div className='prompt-tips'>
                <h6>Keep it short and to the point</h6>
                <p>
                  Example: "Find partners to start an all organic soda company."
                </p>
                <p>
                  Not: "I really want to find people who love soda and want to
                  help me build an organic soda company that everyone will
                  love."
                </p>
                <br />
                <h6>Focus on what you want</h6>
                <p>
                  Example: "Share my music so I can reach 10k followers on
                  Spotify."
                </p>
                <p>
                  Not: "I dont have enough followers so my music never gets
                  played anywhere."
                </p>
              </div>
            </div>
          </div>
          <style jsx>{`
            .title {
              margin-top: 60px;
              font-size: 2.5rem;
            }
            .subtitle {
              padding: 30px 0;
              line-height: 1.5;
            }
            .bold {
              font-weight: bold;
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
            }
          `}</style>
        </Layout>
        <Footer />
      </Format>
    )
  }
}

export default withRouter(CreateDream)
