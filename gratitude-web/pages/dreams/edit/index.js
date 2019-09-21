import React from 'react'
import Dropzone from 'react-dropzone'
import { colors, getFileAsBinary, uploadImage } from '@corcos/lib'
import Link from 'next/link'
import { Data, Loading } from '@corcos/components'
import { toJson } from 'unsplash-js'
import _ from 'lodash'

import {
  Head,
  Navbar,
  Format,
  Textarea,
  Footer,
  Input,
  Button,
  Search,
  Layout
} from '../../../components'

import { db, firebase } from '../../../lib/firebase'
import Context from '../../../lib/context'
import { unsplash } from '../../../lib/unsplash'

const processHashtags = tagList => {
  return tagList
    .split(',')
    .map(v => v.trim())
    .reduce((acc, v) => {
      return {
        [v]: true,
        ...acc
      }
    }, {})
}

const mergeHashtags = hashtags => {
  let tagList = ''
  for (let tag in hashtags) {
    if (tagList !== '') {
      tagList += ', '
    }
    tagList += tag
  }
  return tagList
}

const Method = props => {
  return (
    <div className='button' onClick={props.onClick}>
      {props.title}
      <style jsx>{`
        .button {
          background-color: ${props.isActive ? '#23535D' : 'white'};
          border: 1px solid #23535d;
          border-radius: 5px;
          color: ${props.isActive ? 'white' : '#23535D'};
          flex: 1;
          margin: 5px;
          cursor: pointer;
          justify-content: center;
          align-items: center;
          padding-top: 15px;
          padding-bottom: 15px;
          transition: all 0.3s ease;
          font-weight: 700;
          font-family: Hero New, "Inter UI", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
        }
        .button:hover {
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}

const UploadImage = self => {
  const isEmpty = self.state.imageUrl === ''
  return (
    <div className='col-6 col-sm-4 col-md-4 col-lg-3 container'>
      <Dropzone onDrop={self.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          const inputProps = getInputProps()
          const rootProps = getRootProps()
          return (
            <div {...rootProps} className={`dropzone ${!isEmpty && 'active'}`}>
              <img
                src={
                  !isEmpty
                    ? self.state.imageUrl
                    : '/static/img/icons/image-placeholder.png'
                }
                className='image'
              />

              <input {...inputProps} />
              <div className='text'>
                {isEmpty ? 'UPLOAD YOUR OWN PHOTO' : 'CHANGE PHOTO'}
              </div>
            </div>
          )
        }}
      </Dropzone>
      <style jsx>{`
        .container {
          padding: 5px;
        }
        .dropzone {
          border: 1px dashed ${colors.grey[300]};
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border-radius: 5px;
          border-width: 3px;
          border-height: 1px;
          padding: 10px;
          height: 120px;
        }
        .image {
          height: 40px;
          width: 60px;
          margin-bottom: 5px;
          border-radius: 5px;
          object-fit: cover;
        }
        .text {
          font-size: 14px;
          font-weight: 700;
          padding: 5%;
          text-align: center;
          color: #979797;
        }
        .active {
          border: 3px solid #5eb594;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

const ImageCard = (image, self) => {
  const isSelected = self.state.selectedImage === image.urls.full
  return (
    <div
      className={`col-6 col-sm-4 col-md-4 col-lg-3 container ${isSelected &&
        'selected'}`}
      key={image.id}
    >
      <span
        className={`image-card ${isSelected && 'active'}`}
        style={{
          backgroundImage: `url(${image.urls.thumb})`
        }}
        onClick={() => self.handlelSelectImage(image.urls.full)}
      >
        {isSelected && <img src='/static/img/icons/tick.png' />}
      </span>

      <style jsx>{`
        .container {
          padding: 5px;
        }
        .image-card {
          background-size: cover;
          border-radius: 5px;
          border: 1px solid ${colors.grey[300]};
          height: 120px;
          position: relative;
          cursor: pointer;
          width: 100%;
          justify-content: center;
          align-items: center;
        }
        .active {
          opacity: 0.6;
        }
        .selected {
          padding: 2px;
          border: 3px solid #5eb594;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

const UnsplashImage = self => {
  return (
    <div>
      <div className='search-row row m-0'>
        <div className='col-sm-12 offset-md-3 col-md-6 p-0 mb-3'>
          <Search
            placeholder='Search'
            onChange={_.debounce(self.handleSearchImages, 1000)}
          />
        </div>
      </div>
      {self.state.totalPages === 0 ? (
        <h3 className='no-more-dream'>No Images</h3>
      ) : (
        <div className='row image-list'>
          {UploadImage(self)}
          {self.state.images.map(d => ImageCard(d, self))}
        </div>
      )}

      <div className='button-row'>
        <Button
          style={{
            backgroundColor: 'white',
            color: `#979797`,
            border: `2px solid #979797`,
            boxShadow: 'none',
            marginRight: '10px',
            padding: '10px 20px',
            opacity:
              self.state.page === 1 || self.state.totalPages === 0 ? 0.5 : 1,
            pointerEvents:
              self.state.page === 1 || self.state.totalPages === 0
                ? 'none'
                : 'inherit'
          }}
          onClick={() => self.handlePageClick(self.state.page - 1)}
          title='PREV'
        />
        <Button
          style={{
            backgroundColor: 'white',
            color: `#979797`,
            border: `2px solid #979797`,
            boxShadow: 'none',
            padding: '10px 20px',
            opacity:
              self.state.page === self.state.totalPages ||
              self.state.totalPages === 0
                ? 0.5
                : 1,
            pointerEvents:
              self.state.page === self.state.totalPages ||
              self.state.totalPages === 0
                ? 'none'
                : 'inherit'
          }}
          title='NEXT'
          onClick={() => self.handlePageClick(self.state.page + 1)}
        />
      </div>
      <style jsx>{`
        .search-row {
          justify-content: space-between;
          align-items: flex-end;
        }
        .select-image-row {
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;
        }
        .image {
          height: 100px;
          width: 100px;
          object-fit: cover;
          background-color: #979797;
        }
        .image-list {
          margin: 0 -5px;
        }
        .button-row {
          flex-direction: row;
          width: 100%;
          justify-content: center;
          margin-top: 20px;
          align-items: center;
        }
        .no-more-dream {
          font-size: 18px;
          padding: 20px;
          text-align: center;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

class DreamContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: props.dream.title || '',
      story: props.dream.story || '',
      tagList: mergeHashtags(props.dream.hashtags) || '',
      method: props.dream.method || '',
      imageUrl: props.dream.imageUrl || '',
      dreamId: props.dream.id || '',
      charity: props.dream.charity || '',
      selectedImage: '',
      query: '',
      page: 1,
      totalPages: 0,
      images: [],
      loading: false,
      validation: false
    }
  }

  static contextType = Context;

  componentDidMount () {
    this.getUnsplashImage()
  }

  onDrop = async (acceptedFiles, rejectedFiles) => {
    await this.setState({ loading: true })
    let file
    try {
      file = await getFileAsBinary(acceptedFiles[0])
    } catch (err) {
      console.error(err)
    }

    let url
    try {
      url = await uploadImage({
        contentType: acceptedFiles[0].type,
        firebase,
        path: `/dream-cover/${this.context.currentUser.uid}?${Date.now()}`,
        file
      })
    } catch (err) {
      console.error(err)
    }

    await this.setState({ imageUrl: url, selectedImage: '', loading: false })
  };

  handleSubmit = async () => {
    const {
      title,
      story,
      tagList,
      imageUrl,
      charity,
      dreamId,
      selectedImage
    } = this.state
    if (!title || !story || !tagList) {
      this.setState({ validation: true })
      return null
    }
    const image = imageUrl || selectedImage
    await this.setState({ loading: true, validation: false })
    const hashtags = processHashtags(tagList)
    try {
      await db
        .collection('dreams')
        .doc(dreamId)
        .update({
          title,
          story,
          hashtags,
          charity,
          imageUrl: image
        })
      window.alert('updated!')
    } catch (err) {
      console.error(err)
    }
    await this.setState({ loading: false })
  };

  handleSearchImages = async data => {
    await this.setState({ query: data, page: 1 })
    this.getUnsplashImage()
  };

  handlelSelectImage = data => {
    this.setState({ selectedImage: data, imageUrl: '' })
  };

  handlePageClick = async data => {
    await this.setState({ page: data })
    this.getUnsplashImage()
    console.log(data)
  };

  getUnsplashImage = () => {
    const { query, page } = this.state
    const perPage = 11
    query === '' && this.setState({ query: 'dream' })
    unsplash.search
      .photos(query !== '' ? query : 'dream', page, perPage)
      .then(toJson)
      .then(json => {
        this.setState({ images: json.results, totalPages: json.total_pages })
        console.log(json)
      })
  };

  render () {
    return (
      <div className='row'>
        <div className='col-sm-12 col-md-8'>
          <Loading loading={this.state.loading} />
          <div className='content-part'>
            <h1 className='title'>What is your dream?</h1>
            <div className='subtitle'>
              This should be a clear statement of what you're looking for.
            </div>
            <Input
              placeholder='What is your dream?'
              value={this.state.title}
              onChange={v => this.setState({ title: v })}
              validation={this.state.validation}
              validationText='Your dream must have a title.'
            />
          </div>
          <div className='content-part'>
            <h1 className='title'>Tell us the story</h1>
            <div className='subtitle'>
              Sometimes a few words explaining why you want this helps set the
              right tone.
            </div>
            <Textarea
              placeholder='Type something here...'
              value={this.state.story}
              onChange={v => this.setState({ story: v })}
              validation={this.state.validation}
              validationText='Your dream must have a story.'
            />
            <div style={{ height: 20 }} />
            <div className='subtitle'>
              Enter some relevant hashtags so others can learn about your dream.
            </div>
            <Input
              placeholder='What is your dream?'
              value={this.state.tagList}
              onChange={v => this.setState({ tagList: v })}
              validation={this.state.validation}
              validationText='Your dream must have hashtags.'
            />
            <div className='subtitle-mini'>
              Separate each hashtag with a comma
            </div>
          </div>

          <div className='content-part'>
            <h1 className='title'>Add a photo</h1>
            <div className='subtitle'>
              Visuals can help make a great impression when others see your
              dreams.
            </div>
            {UnsplashImage(this)}
            <div className='subtitle'>
              If no photo is uploaded, Gratitude may choose a photo on your
              behalf to help your dream be seen by more people.
            </div>
          </div>

          <div className='content-part content-opacity'>
            <h1 className='title'>How should people contribute?</h1>
            <div className='subtitle'>
              We currently have three ways for others to contribute. Choose the
              one which you'd like people to use for this dream.
            </div>
            <div className='button-row'>
              <Method
                isActive={this.state.method === 'money'}
                title='Money'
                onClick={() => this.setState({ method: 'money' })}
              />
              <Method
                isActive={this.state.method === 'donation'}
                title='Donation'
                onClick={() => this.setState({ method: 'donation' })}
              />
              <Method
                isActive={this.state.method === 'message'}
                title='Message'
                onClick={() => this.setState({ method: 'message' })}
              />
            </div>
            {this.state.method === 'money' && (
              <div className='subtitle-other'>
                Your contributors will be able to enter any amount which they
                wish to send.
              </div>
            )}
            {this.state.method === 'message' && (
              <div className='subtitle-other'>
                Your contributors will be able to send you messages with an
                optional photo/video.
              </div>
            )}
            {this.state.method === 'donation' && (
              <>
                <div
                  style={{
                    marginTop: 15,
                    flexDirection: 'row'
                  }}
                >
                  <div style={{ fontWeight: 500 }}>Selected Charity:</div>
                  &nbsp;{this.state.charity.charityName}
                </div>
                <div className='subtitle-paypal'>
                  We use the &nbsp;
                  <Link href='/paypal'>
                    <a>PayPal Giving Fund</a>
                  </Link>
                  <p>&nbsp;to distribute</p>
                  <p>&nbsp;donations.</p>
                </div>
                <Search placeholder='Search for any charity name or keyword' />
              </>
            )}
          </div>
          <div className='row mt-2'>
            <div className='col-12 col-sm-8 offset-sm-2 p-0'>
              <Button
                title='UPDATE'
                onClick={() => this.handleSubmit(this.state)}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .row {
            margin: 0;
          }
          .content-part {
            margin-bottom: 40px;
          }
          .title {
            margin-bottom: 15px;
            font-size: 1.8em;
          }
          .subtitle {
            margin-bottom: 30px;
            line-height: initial;
          }
          .subtitle-mini {
            font-size: 14px;
            line-height: initial;
            padding-top: 5px;
          }

          .button-row {
            width: 100%;
            flex-direction: row;
          }
          .button-container {
            align-items: center;
            padding: 10px;
          }
          .subtitle-paypal {
            flex-flow: wrap;
            padding: 20px 0;
          }
          .subtitle-other {
            padding-top: 20px;
          }
          .content-opacity {
            opacity: 0.5;
          }
          @media (max-width: 576px) {
            .title {
              font-size: 24px;
              margin-bottom: 20px;
            }
            .subtitle {
              margin-bottom: 20px;
              font-size: 14px;
            }
            .subtitle-mini {
              font-size: 12px;
            }
            .content-part {
              margin-bottom: 20px;
            }
            .content-part {
              margin-bottom: 30px;
            }
            .subtitle-other,
            .subtitle-paypal {
              font-size: 14px;
            }
            .subtitle-paypal a,
            p {
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    )
  }
}

class DreamEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: '',
      method: 'money',
      query: '',
      loading: false,
      organizations: [],
      selected: null
    }
  }

  static getInitialProps = ({ query }) => {
    return { query }
  };

  componentDidMount () {
    window.analytics.page('pv.website.userDream.edit')
  }

  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <Layout>
          <div className='contain'>
            <Data query={db.collection('dreams').doc(this.props.query.dreamId)}>
              {({ data: dream, loading }) => {
                if (loading) return <Loading loading />
                return <DreamContent dream={dream} query={this.props.query} />
              }}
            </Data>
            <style jsx>{`
              .contain {
                margin: 30px 0 40px 0;
              }
              @media (max-width: 576px) {
                .contain {
                  margin-top: 40px;
                }
              }
            `}</style>
          </div>
        </Layout>
        <Footer />
      </Format>
    )
  }
}

export default DreamEdit
