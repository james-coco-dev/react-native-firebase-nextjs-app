import React from 'react'
import Link from 'next/link'
import { colors } from '@corcos/lib'
import {
  Data
} from '@corcos/components'

import { Layout, Button } from '../'
import Context from '../../lib/context'
import { db } from '../../lib/firebase'

const SignUpSignIn = (self, store) => {
  return (
    <div className='auth-container'>
      {!store.currentUser.uid ? (
        <>
          <Link href='/login'>
            <a className='link'>Log In</a>
          </Link>
          <Link href='/signup'>
            <Button
              style={{
                backgroundColor: 'white',
                color: `#23535D`,
                border: `1px solid #23535D`,
                paddingTop: 10,
                paddingBottom: 10,
                boxShadow: 'none'
              }}
              title='Sign Up'
              onClick={() => {}}
            />
          </Link>
        </>
      ) : (
        <Data query={db.collection('users').doc(store.currentUser.uid)}>
          {({ data: user, loading }) => {
            if (loading) return null
            return (
              <>
                <Link href='/dashboard'>
                  <a className='link'>Discover</a>
                </Link>
                <Link href={{ pathname: `/@${user.username}` }}>
                  <a className='link'>Profile</a>
                </Link>
                <Link href='/settings'>
                  <a className='link'>Settings</a>
                </Link>
                <Link href='/create'>
                  <Button
                    style={{
                      backgroundColor: 'white',
                      color: `#23535D`,
                      border: `1px solid #23535D`,
                      paddingTop: 10,
                      paddingBottom: 10,
                      boxShadow: 'none'
                    }}
                    title='Create a dream'
                    onClick={() => {}}
                  />
                </Link>{' '}
              </>
            )
          }}
        </Data>
      )}
      <style jsx>{`
        .link {
          margin-right: 30px;
          color: ${colors.grey[800]};
          text-decoration: none;
          font-weight: 500;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
        }
        .auth-container {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        @media (max-width: 765px) {
          .auth-container {
            flex-direction: column;
            align-items: left;
            display: contents;
            width: 100%;
          }
          .link {
            padding-bottom: 10px;
          }
        }
      `}</style>
    </div>
  )
}

class Navbar extends React.Component {
  state = {
    navCollapsed: true
  };

  _onToggleNav = () => {
    this.setState({ navCollapsed: !this.state.navCollapsed })
  };

  render () {
    const { navCollapsed } = this.state
    return (
      <nav className='outer-nav'>
        <Layout>
          <div className='navbar-container'>
            <nav
              className='navbar navbar-expand-md bg-white navbar-light'
              data-sticky='top'
            >
              <div className='container'>
                <button
                  className='navbar-toggler'
                  type='button'
                  data-toggle='collapse'
                  data-target='.navbar-collapse'
                  aria-expanded='false'
                  aria-label='Toggle navigation'
                  onClick={this._onToggleNav}
                >
                  <svg
                    className='icon'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M3 17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V17C21 16.4477 20.5523 16 20 16H4C3.44772 16 3 16.4477 3 17V17ZM3 12C3 12.5523 3.44772 13 4 13H20C20.5523 13 21 12.5523 21 12V12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12V12ZM4 6C3.44772 6 3 6.44772 3 7V7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7V7C21 6.44772 20.5523 6 20 6H4Z'
                      fill='#212529'
                    />
                  </svg>
                </button>
                <a className='navbar-brand fade-page' href='/'>
                  <img src='/static/img/logo.svg' alt='Gratitude' />
                </a>

                <div
                  className={
                    (navCollapsed ? '' : 'show') +
                    ' collapse navbar-collapse justify-content-end'
                  }
                >
                  <Context.Consumer>
                    {store => {
                      return (
                        <div
                          className={
                            navCollapsed
                              ? 'navbar-action-container'
                              : 'navbar-action-container-mob'
                          }
                        >
                          {SignUpSignIn(this, store)}
                        </div>
                      )
                    }}
                  </Context.Consumer>
                </div>
              </div>
            </nav>
          </div>
        </Layout>

        <style jsx>{`
          .row {
            margin: 0;
          }
          .container {
            padding: 0;
          }
          .outer-nav {
            width: 100%;
            flex-direction: row;
            border-bottom: 1px solid ${colors.grey[300]};
          }
          .brand-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .brand-title img {
            padding-left: 10px;
            font-size: 24px;
            color: #2361ff;
            font-weight: 600;
            max-height: 28px;
          }
          .navbar {
            display: flex;
            height: 73px;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            padding: 0;
          }
          .navbar-action-container {
            margin-right: 15px;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .container {
            flex-direction: row;
          }
          .navbar-collapse {
            flex-grow: 0;
          }
          @media (max-width: 576px) {
            .outer-nav {
              border-bottom: 0;
            }
          }
          @media (max-width: 765px) {
            .navbar-brand {
              margin-left: auto !important;
              margin-right: auto !important;
              display: flex;
            }
            .navbar {
              height: 100% !important;
              padding: 8px 16px;
            }
            .navbar-action-container-mob {
              width: 100%;
            }
            .navbar-toggler {
              border: 0;
              padding: 0;
            }
          }
          @media (max-width: 1200px) {
            .container {
              justify-content: unset;
              display: contents;
              margin: 0;
            }
            .navbar-brand {
              margin-left: 16px;
            }
          }
        `}</style>
      </nav>
    )
  }
}

export default Navbar
