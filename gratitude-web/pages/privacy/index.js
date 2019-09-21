import React from 'react'

// eslint-disable-next-line
import privacy from 'raw-loader!./privacy.html'

class Privacy extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: privacy }} />
      </>
    )
  }
}

export default Privacy
