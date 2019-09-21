import React from 'react'
import Link from 'next/link'
import { colors } from '@corcos/lib'

import { Layout } from '../'

class Footer extends React.Component {
  render () {
    return (
      <footer className='footer'>
        <Layout>
          <a href='index.html'>
            <img src='/static/img/logo.svg' alt='Gratitude' />
          </a>
          <div className='row m-0'>
            <div className='col'>
              <ul className='nav link-row justify-content-center'>
                <li className='nav-item'>
                  <Link href='/'>
                    <a className='link'>Home</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='mailto:gratitude@creatorland.co'>
                    <a className='link'>Support</a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <a href='/terms' className='link'>
                    Terms
                  </a>
                </li>
                <li className='nav-item'>
                  <a href='/privacy' className='link'>
                    Privacy
                  </a>
                </li>
                <li className='nav-item'>
                  <Link href='mailto:gratitude@creatorland.co'>
                    <a className='link'>Contact</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='terms'>
            Creatorland NYC, LLC ©2019 All Rights Reserved.
          </div>
        </Layout>

        <style jsx>{`
          .link-row {
            flex-direction: row;
            justify-content: center;
            padding-bottom: 20px;
            padding-top: 30px;
            margin-bottom: 20px;
          }
          .terms {
            align-self: center;
            text-align: center;
            color: ${colors.grey[400]};
            font-size: 13px;
            line-height: 20px;
            width: 85%;
            padding-bottom: 50px;
          }
          .link {
            padding: 20px;
            text-decoration: none;
            color: ${colors.grey[600]};
          }
          .footer {
            padding-top: 80px;
            background-color: #fafbfd;
          }
          @media (max-width: 576px) {
            .footer {
              padding-top: 30px;
            }
            .link-row {
              padding: 10px 0;
              margin-bottom: 0;
            }
            .link {
              padding: 5px;
            }
            .terms {
              padding-bottom: 20px;
            }
          }
        `}</style>
      </footer>
    )
  }
}

export default Footer
