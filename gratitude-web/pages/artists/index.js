import React from 'react'

// eslint-disable-next-line
import artists from 'raw-loader!./artists.html'

class Artists extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: artists }} />
      </>
    )
  }
}

export default Artists
