import React from 'react'
import { colors, elevation } from '@corcos/lib'

class Textarea extends React.Component {
  render () {
    return (
      <>
        <textarea
          style={this.props.style}
          value={this.props.value}
          onChange={e => this.props.onChange(e.target.value)}
          placeholder={this.props.placeholder}
          className='textarea'
        />
        {this.props.value === '' && this.props.validation && (
          <label className='error'>{this.props.validationText}</label>
        )}
        <style jsx>{`
          .textarea {
            border: 1px solid ${colors.grey[200]};
            border-radius: 5px;
            height: 160px;
            padding: 15px;
            outline: none;
            font-size: 16px;
            transition: all 0.2s ease;
            margin: 5px 0;
          }
          .textarea::placeholder {
            color: ${colors.grey[400]};
          }
          .textarea:focus {
            box-shadow: ${elevation[1]};
          }
          .textarea-title {
            padding-bottom: 15px;
            color: ${colors.grey[400]};
            margin-top: 20px;
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
      </>
    )
  }
}

Textarea.defaultProps = {
  style: {},
  validation: false,
  validationText: ''
}

export default Textarea
