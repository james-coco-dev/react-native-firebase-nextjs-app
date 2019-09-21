import React from 'react'
import { colors } from '@corcos/lib'
import { Loading } from '@corcos/components'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { Head, Layout, Input, Button, Format } from '../../components'

import { firebase } from '../../lib/firebase'

class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
      isClick: false,
      loading: false,
      validation: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.signUp')
  }

  _handleSubmit = async () => {
    if (this.state.isClick) return null
    this.setState({ isClick: true })

    if (!/@/g.test(this.state.email)) {
      this.setState({ isClick: false, validation: true })
      return null
    }
    if (!this.state.fullName) {
      this.setState({ isClick: false, validation: true })
      return null
    }
    if (!this.state.password || this.state.password.length < 8) {
      this.setState({ isClick: false, validation: true })
      return null
    }
    if (!(this.state.password === this.state.passwordConfirm)) {
      this.setState({ isClick: false, validation: true })
      return null
    }

    this.setState({ loading: true, validation: false })
    // if all checks pass, create a new user
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
      await firebase.functions().httpsCallable('createAccount')({
        fullName: this.state.fullName
      })
      await this.setState({
        email: '',
        password: '',
        passwordConfirm: '',
        fullName: ''
      })
      this.props.router.push({ pathname: '/dashboard', query: { new: 1 } })
    } catch (err) {
      this.setState({ error: err.message })
      // prevent execution of the rest of the block
      this.setState({ isClick: false, loading: false })
      return null
    }

    this.setState({ loading: false })
  };

  render () {
    return (
      <Format>
        <Head />
        <Layout>
          <div className='content'>
            <Loading loading={this.state.loading} />
            <div className='title'>
              <h1>Sign Up</h1>
            </div>
            <div className='has-account'>
              Already have an account?&nbsp;
              <Link href='/login'>
                <a>Sign in</a>
              </Link>
            </div>
            <Input
              label='FULL NAME'
              value={this.state.fullName}
              onChange={v => this.setState({ fullName: v })}
              placeholder='Full Name'
              validation={this.state.validation}
              validationText='You must enter your name.'
            />
            <Input
              label='EMAIL'
              type='email'
              value={this.state.email}
              onChange={v => this.setState({ email: v })}
              placeholder='Email'
              validation={this.state.validation}
              validationText='Invalid email address'
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
            <div className='chars'>Must be at least 8 characters</div>
            <Input
              label='CONFIRM PASSWORD'
              type='password'
              value={this.state.passwordConfirm}
              onChange={v => this.setState({ passwordConfirm: v })}
              placeholder='Confirm Password'
              validation={this.state.validation}
              validationText='Passwords do not match.'
            />
            <div className='terms-row'>
              <div className='terms'>
                By joining, you accept our&nbsp;
                <a href='/terms' className='terms-text'>
                  Terms of Service&nbsp;
                </a>
                and&nbsp;
                <a href='/privacy' className='terms-text'>
                  Privacy Policy.
                </a>
              </div>
            </div>
            <div style={{ height: 10 }} />
            <Button title='Sign Up' onClick={this._handleSubmit} />
          </div>

          <style jsx>{`
            .has-account {
              flex-direction: row;
              text-align: center;
              justify-content: center;
              padding-top: 25px;
              padding-bottom: 25px;
              font-weight: 400;
            }
            .line {
              border-bottom: 1px solid ${colors.grey[300]};
              width: 100%;
              padding-top: 30px;
            }
            .checkbox {
              margin-right: 10px;
            }
            .terms-row {
              flex-direction: row;
              padding-top: 15px;
              padding-bottom: 15px;
            }
            .terms {
              flex-flow: wrap;
              font-size: 13px !important;
              color: #9da5af;
              margin-top: 5px;
              line-height: initial;
            }
            .terms-text {
              font-size: 13px !important;
              color: #9da5af;
              text-decoration: underline;
              display: contents;
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
            }
            .subtitle {
              text-align: center;
              padding-top: 10px;
              color: ${colors.grey[800]};
              font-weight: 400;
              padding-bottom: 30px;
            }
            .content {
              margin: 80px 0 30px 0;
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

export default withRouter(Signup)
