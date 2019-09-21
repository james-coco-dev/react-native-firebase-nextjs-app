import React from 'react'
import App, { Container } from 'next/app'
import { AuthBindings } from '@corcos/components'

import { firebase } from '../lib/firebase'
import Context from '../lib/context'

import {
  Provider
} from '../components'

// using this additional container to bind firebase auth listener to store
class _App extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Provider>
          <Context.Consumer>
            {store => (
              <>
                {/* <AuthModal firebase={firebase} store={store} context={Context} /> */}
                <AuthBindings firebase={firebase} store={store} />
                <Component style={{ height: 1000 }} store={store} {...pageProps} />
              </>
            )}
          </Context.Consumer>
        </Provider>
      </Container>
    )
  }
}

export default _App
