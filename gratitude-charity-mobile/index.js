import React from 'react'
import { View, AppRegistry } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { AuthBindings } from '@corcos/components/native'

import firebase from './lib/firebase'
import { Context, initialState } from './lib/context'
import NavigationService from './lib/NavigationService'
import { name as appName } from './app.json'

import {
  Provider,
  AuthModalPhone
} from './components'

import Landing from './screens/Landing'
import Onboarding from './screens/Onboarding'
import CharitySelect from './screens/CharitySelect'
import Send from './screens/Send'
import SendProfile from './screens/SendProfile'
import Profile from './screens/Profile'
import SendPayment from './screens/SendPayment'
import Home from './screens/Home'
import SendSuccess from './screens/SendSuccess'

const AppNavigator = createStackNavigator({
  Landing: { screen: Landing },
  Onboarding: { screen: Onboarding },
  CharitySelect: { screen: CharitySelect },
  Send: { screen: Send },
  SendProfile: { screen: SendProfile },
  Profile: { screen: Profile },
  SendPayment: { screen: SendPayment },
  Home: { screen: Home },
  SendSuccess: { screen: SendSuccess }
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
                <App ref={ref => { NavigationService.setTopLevelNavigator(ref) }} {...this.props} />
              </View>
            )
          }}
        </Context.Consumer>
      </Provider>
    )
  }
}

export default AppRegistry.registerComponent(appName, () => _App)
