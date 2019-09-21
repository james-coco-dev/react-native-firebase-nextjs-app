import React from 'react'

// eslint-disable-next-line
import education from 'raw-loader!./education.html'

class Education extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: education }} />
      </>
    )
  }
}

export default Education
