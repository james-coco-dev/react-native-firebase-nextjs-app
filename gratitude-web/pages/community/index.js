import React from 'react'

// eslint-disable-next-line
import community from 'raw-loader!./community.html'

class Community extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: community }} />
      </>
    )
  }
}

export default Community
