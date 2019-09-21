import React from 'react'
/**
 * A standard input component
 *
 * @param {string} value - the value of the controlled component
 * @param {string} type - determines the input type (default: text)
 * @param {function} onChange - determines what happens when a value changes
 */
class Search extends React.Component {
  render () {
    return (
      <div className='form-group'>
        {this.props.tag ? (
          <>
            <span className='form-tag-control-feedback'>{this.props.tag}</span>
            <input
              className='form-control form-tag-control'
              onFocus={this.props.onFocus}
              onClick={this.props.onClick}
              placeholder={this.props.placeholder}
              style={this.props.style}
              type={this.props.type}
              value={this.props.value}
              onChange={e => this.props.onChange(e.target.value)}
            />
            {this.props.value === '' && this.props.validation && (
              <label className='error'>{this.props.validationText}</label>
            )}
          </>
        ) : (
          <>
            <span className='fa fa-search form-control-feedback' />
            <input
              className='form-control'
              onFocus={this.props.onFocus}
              onClick={this.props.onClick}
              placeholder={this.props.placeholder}
              style={this.props.style}
              type={this.props.type}
              value={this.props.value}
              onChange={e => this.props.onChange(e.target.value)}
            />
          </>
        )}
        <style jsx>{`
          .form-group {
            margin: 5px 0;
          }
          .form-control {
            padding-left: 2.375rem;
          }
          .form-control-feedback {
            position: absolute;
            z-index: 2;
            display: block;
            width: 2.375rem;
            height: 2.375rem;
            line-height: 2.375rem;
            text-align: center;
            pointer-events: none;
            color: black;
          }
          .form-tag-control {
            padding-left: 3.375rem;
          }
          .form-tag-control-feedback {
            font-weight: 300;
            position: absolute;
            z-index: 2;
            display: block;
            width: 2.375rem;
            height: 2.375rem;
            line-height: 2.375rem;
            text-align: center;
            pointer-events: none;
            color: black;
            border-right: 1px solid #dee2e6 !important;
          }
          .error {
            color: red;
            margin: 10px 0 10px 0;
            font-size: 13px;
            font-weight: 700;
            font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
          }
        `}</style>
      </div>
    )
  }
}

Search.defaultProps = {
  onChange: text => {
    console.error('Missing onChange prop: ', text)
  },
  style: {},
  type: 'text',
  tag: '',
  validation: false,
  validationText: '',
  onFocus: () => {},
  onClick: () => {}
}

export default Search
