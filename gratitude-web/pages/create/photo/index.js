import React from 'react'
import { colors, getFileAsBinary, uploadImage } from '@corcos/lib'
import { Loading } from '@corcos/components'
import { withRouter } from 'next/router'
import Dropzone from 'react-dropzone'
import { toJson } from 'unsplash-js'
import _ from 'lodash'
import {
  Head,
  Navbar,
  Format,
  CreateDreamHeader,
  Layout,
  Button,
  Footer,
  Search
} from '../../../components'

import validateDreamAndRedirect from '../../../lib/validateDreamAndRedirect'
import Context from '../../../lib/context'
import { firebase } from '../../../lib/firebase'
import { unsplash } from '../../../lib/unsplash'

const UploadImage = self => {
  const isEmpty = self.state.image === ''
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
                    ? self.state.image
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

class CreateDreamPhoto extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: '',
      selectedImage: '',
      query: '',
      page: 1,
      totalPages: 0,
      images: [],
      loading: false,
      validation: false
    }
  }

  componentDidMount () {
    window.analytics.page('pv.website.createDream.photo')
    validateDreamAndRedirect(this.context.dream, this.props.router.push)
    if (this.props.store.currentUser.uid === undefined) {
      this.props.router.push('/login')
    }
    this.getUnsplashImage()
  }

  static contextType = Context;

  _handleSubmit = async store => {
    const { image, selectedImage } = this.state
    if (!image && !selectedImage) {
      this.setState({ validation: true })
      return null
    }
    const imageUrl = image || selectedImage
    await this.setState({ loading: true, validation: false })
    store.set('dream', { ...store.dream, imageUrl: imageUrl })
    this.props.router.push('/create/contribute')
    await this.setState({ loading: false })
  };

  handleSearchImages = async data => {
    await this.setState({ query: data, page: 1 })
    this.getUnsplashImage()
  };

  handlelSelectImage = data => {
    this.setState({ selectedImage: data, image: '' })
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

    await this.setState({ image: url, selectedImage: '', loading: false })
  };

  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <CreateDreamHeader index={2} />
        <Layout>
          <div className='row mx-2'>
            <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
              <Loading loading={this.state.loading} />
              <h1 className='title'>Add a photo</h1>
              <div className='subtitle'>
                Visuals can help make a great impression when others see your
                dreams.
              </div>
              {UnsplashImage(this)}
              {this.state.image === '' && this.state.validation && (
                <label className='error'>You must include a cover photo</label>
              )}
              <div className='subtitle'>
                If no photo is uploaded, Gratitude may choose a photo on your
                behalf to help your dream be seen by more people.
              </div>
              <Context.Consumer>
                {store => (
                  <div className='row mt-2'>
                    <div className='col-sm-4 offset-sm-8 col-md-3 offset-md-9'>
                      <Button
                        title='CONTINUE'
                        onClick={() => this._handleSubmit(store)}
                      />
                    </div>
                  </div>
                )}
              </Context.Consumer>
              <div className='prompt-tips'>
                <h6>Choose a photo that portrays whats you want</h6>
                <p>
                  Photos of people or animals work well. If your dream is for a
                  physical item, we recommend a photo of the item being used in
                  real life.
                </p>
                <br />
                <h6>
                  Try to upload photos that are 1600 x 900 pixels or larger
                </h6>
                <p>Large photos look good on all screen sizes.</p>
                <br />
                <h6>Keep it friendly for all audiences</h6>
                <p>
                  Make sure your photo doesn't include graphic violence or
                  sexual content.
                </p>
              </div>
            </div>
          </div>

          <style jsx>{`
            .title {
              margin-top: 60px;
              font-size: 2.5rem;
            }
            .subtitle {
              padding: 30px 0;
              line-height: 1.5;
            }
            .prompt-tips {
              color: ${colors.grey[600]};
              text-align: left;
              padding: 20px;
              line-height: 1.5;
              margin: 70px 0;
              background-color: #fafbfd;
              border: 1px solid #dee2e6 !important;
              border-radius: 0.25rem !important;
            }
            .prompt-tips p {
              margin-bottom: 0.5rem;
            }
            .error {
              color: red;
              margin: 10px 0 10px 0;
              font-size: 13px;
              font-weight: 700;
              font-family: Hero New, "Inter UI", -apple-system,
                BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
                sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
                "Segoe UI Symbol", "Noto Color Emoji";
            }
            @media (max-width: 576px) {
              .title {
                font-size: 24px;
                margin-top: 40px;
              }
              .subtitle {
                padding: 20px 0;
                font-size: 14px;
              }
              .prompt-tips {
                margin: 20px 0;
              }
            }
          `}</style>
        </Layout>
        <Footer />
      </Format>
    )
  }
}

export default withRouter(CreateDreamPhoto)
