import React from 'react'
import { View, AppRegistry } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { AuthBindings } from '@corcos/components/native'

import firebase from './lib/firebase'
import { Context, initialState } from './lib/context'
import NavigationService from './lib/NavigationService'
import { name as appName } from './app.json'

import {
  PlaidModal,
  Provider,
  AuthModalPhone
} from './components'

import Home from './screens/Home'
import Transactions from './screens/Transactions'
import Send from './screens/Send'
import Onboarding from './screens/Onboarding'
import OnboardingDreams from './screens/OnboardingDreams'
import OnboardingSuccess from './screens/OnboardingSuccess'
import Profile from './screens/Profile'

const AppNavigator = createStackNavigator({
  Home: { screen: Home },
  Transactions: { screen: Transactions },
  Send: { screen: Send },
  Onboarding: { screen: Onboarding },
  OnboardingDreams: { screen: OnboardingDreams },
  OnboardingSuccess: { screen: OnboardingSuccess },
  Profile: { screen: Profile }
})

const App = createAppContainer(AppNavigator)

/**
 * Component used to wrap anything that exists above the router, such as Firebase
 * auth bindings and some modals
 */
class _App extends React.Component {
  render () {
    return (
      <Provider ref={this.provider} firebase={firebase} context={Context} initialState={initialState}>
        <Context.Consumer>
          {store => {
            return (
              <View style={{ flex: 1 }}>
                <AuthBindings firebase={firebase} store={store} />
                <AuthModalPhone firebase={firebase} context={Context} store={store} {...this.props} />
                <PlaidModal firebase={firebase} store={store} {...this.props} />
                <App ref={ref => { NavigationService.setTopLevelNavigator(ref) }} {...this.props} />
              </View>
            )
          }}
        </Context.Consumer>
      </Provider>
    )
  }
}

// AppRegistry.registerComponent(appName, () => App)

export default AppRegistry.registerComponent(appName, () => _App)
