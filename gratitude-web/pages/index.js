import React from 'react'

// eslint-disable-next-line
import home from 'raw-loader!./home.html'

class Home extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: home }} />
      </>
    )
  }
}

export default Home
