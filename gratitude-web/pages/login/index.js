import React from 'react'
import { colors } from '@corcos/lib'
import Link from 'next/link'
import { withRouter } from 'next/router'

import { Head, Layout, Format, Input, Button } from '../../components'

import { firebase } from '../../lib/firebase'
import customColors from '../../lib/colors'
import Context from '../../lib/context'
import { Loading } from '@corcos/components'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      keep: false,
      email: '',
      password: '',
      loading: false,
      validation: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.logIn')
  }

  _handleSubmit = async () => {
    if (!/@/g.test(this.state.email)) {
      this.setState({ validation: true })
      return null
    }
    if (!this.state.password) {
      this.setState({ validation: true })
      return null
    }

    await this.setState({ loading: true, validation: false })
    // if all checks pass, create a new user
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
      await this.setState({
        email: '',
        password: ''
      })
      this.props.router.push('/dashboard')
    } catch (err) {
      this.setState({ error: err.message, loading: false })
      // prevent execution of the rest of the block
      return null
    }
  };

  componentDidUpdate () {
    if (this.props.store.currentUser.uid) {
      // if the user is logged in, push to dashboard
      this.props.router.push('/dashboard')
    }
  }

  render () {
    return (
      <Format>
        <Head />
        <Layout>
          <Loading loading={this.state.loading} />
          <div className='content'>
            <div className='title'>
              <h1>Sign In</h1>
            </div>
            <div className='has-account'>
              Don’t have an account?&nbsp;
              <Link href='/signup'>
                <a>Sign up</a>
              </Link>
            </div>
            {this.state.error && (
              <div className='error'>{this.state.error}</div>
            )}
            <Input
              label='EMAIL'
              type='email'
              value={this.state.email}
              onChange={v => this.setState({ email: v })}
              placeholder='Email'
              validation={this.state.validation}
              validationText='Invalid email address.'
            />
            <Input
              label='PASSWORD'
              type='password'
              value={this.state.password}
              onChange={v => this.setState({ password: v })}
              placeholder='Password'
              validation={this.state.validation}
              validationText='Missing password or Must be at least 8 characters'
            />
            <div
              className='forgot'
              onClick={() =>
                window.alert(
                  'This feature is coming soon! Please email us at gratitude@creatorland.co if you need help with this.'
                )
              }
            >
              Forgot password?
            </div>
            <div style={{ height: 10 }} />
            <Button
              title='SIGN IN'
              onClick={this._handleSubmit}
              color='#23535D'
            />
          </div>

          <style jsx>{`
            .error {
              color: ${colors.red[700]};
            }
            .has-account {
              flex-direction: row;
              text-align: center;
              justify-content: center;
              padding-top: 25px;
              padding-bottom: 25px;
              font-weight: 400;
            }
            .forgot {
              color: ${customColors.primary};
              font-size: 13px;
              padding-top: 10px;
              padding-bottom: 20px;
              cursor: pointer;
              text-align: right;
              text-decoration: underline;
            }
            .line {
              border-bottom: 1px solid ${colors.grey[300]};
              width: 100%;
              padding-top: 30px;
            }
            .checkbox {
              margin-right: 10px;
            }
            .keep-row {
              flex-direction: row;
              padding-top: 15px;
            }
            .keep {
              flex-direction: row;
              color: ${colors.grey[400]};
            }
            .chars {
              font-size: 12px;
              padding-bottom: 10px;
              color: ${colors.grey[400]};
            }
            .title {
              font-size: 32px;
              padding-top: 40px;
              text-align: center;
              font-weight: 700;
            }
            .subtitle {
              text-align: center;
              padding-top: 10px;
              color: ${colors.grey[800]};
              padding-bottom: 30px;
              padding-top: 10px;
            }
            .content {
              margin-top: 130px;
              padding: 20px;
              width: 450px;
              align-self: center;
              border: 1px solid #dee2e6;
              border-radius: 0.25rem;
            }
            .brand-title {
              padding-top: 60px;
              text-align: center;
              padding-left: 10px;
              font-size: 24px;
              color: black;
              font-weight: 600;
              padding-bottom: 100px;
            }
            @media (max-width: 480px) {
              .content {
                width: 90%;
                padding: 0;
                border: 0px;
              }
            }
          `}</style>
        </Layout>
      </Format>
    )
  }
}

const ContextWrapper = props => {
  return (
    <Context.Consumer>
      {store => <Login store={store} {...props} />}
    </Context.Consumer>
  )
}

export default withRouter(ContextWrapper)
