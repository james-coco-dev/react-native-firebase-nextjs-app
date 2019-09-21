import React from 'react'
import { colors } from '@corcos/lib'

class CreateDreamHeader extends React.Component {
  render () {
    const { index } = this.props
    return (
      <div className='row px-2 contain m-0'>
        <div className='col-md-10 offset-md-1 col-lg-8 offset-lg-2'>
          <div className='state-row'>
            <div className='state'>
              <img className='check' src='/static/check-progress.svg' />
              <div className='check-name'>Name your dream</div>
              <div className='check-name-mob'>Step 1</div>
            </div>
            <div className='state'>
              {index >= 1 ? (
                <img className='check' src='/static/check-progress.svg' />
              ) : (
                <div className='empty' />
              )}
              <div className={index >= 1 ? 'check-name' : 'name'}>
                Tell your story
              </div>
              <div className={index >= 1 ? 'check-name-mob' : 'name-mob'}>
                Step 2
              </div>
            </div>
            <div className='state'>
              {index >= 2 ? (
                <img className='check' src='/static/check-progress.svg' />
              ) : (
                <div className='empty' />
              )}
              <div className={index >= 2 ? 'check-name' : 'name'}>
                Add a photo
              </div>
              <div className={index >= 2 ? 'check-name-mob' : 'name-mob'}>
                Step 3
              </div>
            </div>
            <div className='state'>
              {index >= 3 ? (
                <img className='check' src='/static/check-progress.svg' />
              ) : (
                <div className='empty' />
              )}
              <div className={index >= 3 ? 'check-name' : 'name'}>
                Choose contribution
              </div>
              <div className={index >= 3 ? 'check-name-mob' : 'name-mob'}>
                Step 4
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .check {
            height: 30px;
            width: 30px;
          }
          .empty {
            height: 30px;
            width: 30px;
            border-radius: 50%;
            border: 2px solid ${colors.grey[600]};
          }
          .name {
            padding-left: 5px;
            color: ${colors.grey[800]};
            font-weight: 500;
          }
          .check-name {
            padding-left: 5px;
            color: #23535d;
            font-weight: 500;
          }
          .state-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .state {
            flex-direction: row;
            align-items: center;
          }
          .name-mob {
            padding-left: 5px;
            color: ${colors.grey[800]};
            font-weight: 400;
            display: none;
          }
          .check-name-mob {
            padding-left: 5px;
            color: #23535d;
            font-weight: 400;
            display: none;
          }
          .contain {
            border-bottom: 1px solid ${colors.grey[300]};
            align-items: center;
            height: 80px;
          }
          @media (max-width: 576px) {
            .name-mob,
            .check-name-mob {
              display: block;
            }
            .name,
            .check-name,
            .check,
            .empty {
              display: none;
            }
            .state-row {
              margin: 0 15px;
            }
            .contain {
              height: 60px;
            }
          }
        `}</style>
      </div>
    )
  }
}

CreateDreamHeader.defaultProps = {
  index: 0
}

export default CreateDreamHeader
