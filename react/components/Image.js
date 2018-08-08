import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ContentLoader from 'react-content-loader'

export default class Image extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLaoded: false,
    }
  }

  stripImageUrl(url) {
    return url.replace(/^(http(s?):)/, '')
  }

  imgLoader = () => (
    <ContentLoader height={140} width={140} speed={1}>
      <rect x="0" y="0" rx="5" ry="5" width="500" height="500" />
    </ContentLoader>
  )

  render() {
    const { url, alt } = this.props

    return (
      <Fragment>
        <img className="vtex-minicart__item-image" onLoad={() => this.setState({ isLaoded: true })} src={this.stripImageUrl(url)} alt={alt} />
        {!this.state.isLaoded && this.imgLoader()}
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
