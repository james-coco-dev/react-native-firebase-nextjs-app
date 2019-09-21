import React from 'react'

// eslint-disable-next-line
import booth from 'raw-loader!./booth.html'

class BOOTH extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: booth }} />
      </>
    )
  }
}

export default BOOTH
