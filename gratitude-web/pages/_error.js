/**
 * Creating a page named _error.js lets you override HTTP error messages
 */
import React from 'react'
import { withRouter } from 'next/router'
import { Format } from '../components'

class ErrorPage extends React.Component {
  static propTypes () {
    return {
      errorCode: React.PropTypes.number.isRequired,
      url: React.PropTypes.string.isRequired
    }
  }

  static getInitialProps ({ res, xhr }) {
    const errorCode = res ? res.statusCode : xhr ? xhr.status : null
    return { errorCode }
  }

  render () {
    var response
    switch (this.props.errorCode) {
      case 200: // Also display a 404 if someone requests /_error explicitly
      case 404:
      case 500:
        response = (
          <Format>
            <div className='content'>
              <div className='title'>Gratitude</div>
              <div className='alert'>
                <div className='alert-text'>
                  Don't worry you definitely typed the
                </div>
                <div className='alert-text'>correct URL, it's the</div>
                <div className='alert-text'>keyboard's fault.</div>
              </div>
              <div className='somewhere'>
                <a href='/'>Let’s go somewhere else</a>
              </div>
            </div>
            <style jsx>{`
              .content {
                width: 100%;
                height: 100%;
                background-color: rgb(219, 236, 229);
                align-self: center;
                align-items: center;
              }
              .title {
                font-size: 25px;
                padding-top: 60px;
                text-align: center;
                font-weight: 700;
                color: #072777;
              }
              .alert {
                text-align: center;
                justify-content: center;
                padding-top: 250px;
                font-weight: 300;
                font-size: 38px;
                color: #072777;
                line-height: initial;
              }
              .alert-text {
                font-weight: 300;
                font-size: 38px;
                color: #072777;
              }
              .somewhere {
                text-align: center;
                justify-content: center;
                padding-top: 45px;
                padding-bottom: 210px;
                font-weight: 300;
              }
              .somewhere a {
                color: white !important;
                font-size: 20px;
              }
            `}</style>
          </Format>
        )
        break
      default:
        response = (
          <div>
            <h1 className='display-4'>HTTP {this.props.errorCode} Error</h1>
            <p>
              An <strong>HTTP {this.props.errorCode}</strong> error occurred
              while trying to access{' '}
              <strong>{this.props.router.pathname}</strong>
            </p>
          </div>
        )
    }

    return response
  }
}

export default withRouter(ErrorPage)
