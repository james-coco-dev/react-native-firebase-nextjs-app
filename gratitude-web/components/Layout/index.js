import React from 'react'

class Layout extends React.Component {
  render () {
    return (
      <div className='outer' style={this.props.outer}>
        <div className='inner' style={this.props.inner}>
          {this.props.children}
        </div>

        <style jsx>{`
          .outer {
            align-items: center;
            width: 100%;
          }
          .inner {
            width: 1140px;
          }
          @media (max-width: 1140px) {
            .inner {
              width: 100%;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Layout
