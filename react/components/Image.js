import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ContentLoader from 'react-content-loader'

import minicart from '../minicart.css'
export default class Image extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
    }
  }

  stripImageUrl(url) {
    return url.replace(/^(http(s?):)/, '')
  }

  imgLoader = () => (
    <ContentLoader
      style={{
        width: '100%',
        height: '100%',
      }}
      height={100}
      width={100}
    >
      <rect className={`${minicart.item_imageLoader}`} />
    </ContentLoader>
  )

  render() {
    const { url, alt } = this.props

    return (
      <Fragment>
        <img
          className={`${minicart.item_imageLoader} w-auto h-100`}
          onLoad={() => this.setState({ isLoaded: true })}
          src={this.stripImageUrl(url)} alt={alt}
        />
        {!this.state.isLoaded && this.imgLoader()}
      </Fragment>
    )
  }
}

Image.propTypes = {
  /* Image's url */
  url: PropTypes.string.isRequired,
  /* Image's alt */
  alt: PropTypes.string.isRequired,
}
