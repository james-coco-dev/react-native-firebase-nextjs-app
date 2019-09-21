import React from 'react'
import { colors, elevation } from '@corcos/lib'

/**
 * A standard input component
 *
 * @param {string} value - the value of the controlled component
 * @param {string} type - determines the input type (default: text)
 * @param {function} onChange - determines what happens when a value changes
 */
class Input extends React.Component {
  state = {
    validation: true
  };
  changeValue = value => {
    this.props.onChange(value)
    switch (this.props.type) {
      case 'email':
        this.setState({ validation: !/@/g.test(value) })
        break
      case 'password':
        this.setState({
          validation: !value || value.length < 8
        })
        break
    }
  };

  render () {
    return (
      <div className='contain'>
        {this.props.label && (
          <label className='label'>{this.props.label}</label>
        )}
        <input
          onFocus={this.props.onFocus}
          onClick={this.props.onClick}
          placeholder={this.props.placeholder}
          className='input'
          style={this.props.style}
          type={this.props.type}
          value={this.props.value}
          onChange={e => this.changeValue(e.target.value)}
        />
        {this.props.type === 'email' || this.props.type === 'password'
          ? this.state.validation &&
            this.props.validation && (
            <label className='error'>{this.props.validationText}</label>
          )
          : this.props.value === '' &&
            this.props.validation && (
            <label className='error'>{this.props.validationText}</label>
          )}
        <style jsx>{`
          .contain {
            display: flex;
            flex-direction: column;
            margin-top: 5px;
            margin-bottom: 5px;
          }
          .input {
            border: 1px solid ${colors.grey[200]};
            border-radius: 3px;
            background-color: white;
            outline: none;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 15px;
            padding-right: 3px;
            font-size: 16px;
            transition: all 0.2s ease;
          }
          input::placeholder {
            color: ${colors.grey[400]};
          }
          .input:focus {
            box-shadow: ${elevation[1]};
          }
          .label {
            color: black;
            margin: 10px 0 10px 0;
            font-size: 13px;
            font-weight: 700;
            font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
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

Input.defaultProps = {
  onChange: text => {
    console.error('Missing onChange prop: ', text)
  },
  label: '',
  style: {},
  type: 'text',
  validation: false,
  validationText: '',
  onFocus: () => {},
  onClick: () => {}
}

export default Input
