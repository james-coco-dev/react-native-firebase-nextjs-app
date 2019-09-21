import { NavigationActions } from 'react-navigation'

let _navigator

function setTopLevelNavigator (navigatorRef) {
  _navigator = navigatorRef
}

function navigate (routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

// add other navigation functions that you need and export them
// https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
// used to navigate when you dont have the navigation prop
export default {
  navigate,
  setTopLevelNavigator
}
