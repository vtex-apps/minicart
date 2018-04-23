import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'
import { Link } from 'render'
import CloseIcon from '@vtex/styleguide/lib/icon/Close'

export default class MiniCartItem extends Component {
    static propTypes = {
        imageUrl: PropTypes.string,
        name: PropTypes.string,
        price: PropTypes.number,
        productId: PropTypes.string,
        skuName: PropTypes.string,
    }

    static contextTypes = {
        culture: PropTypes.object,
    }

    render() {
        const styleImg = {
            width: '84px',
            height: '84px',
        }
        const style = {
            height: '103px',
        }
        const { imageUrl, name, price, productId, skuName } = this.props
        console.log(skuName)
        return (
            <div className='relative flex flex-row' style={style}>
                <Link
                    page={'store/product'}
                    params={{ id: productId }}>
                    <div className='flex flex-row'>
                        <img style={styleImg} src={imageUrl} alt={productId} />
                        <div className='flex flex-column'>
                            <div className='fl'><span>{name}</span></div>
                            <div className='fl'><span>{skuName}</span></div>
                        </div>
                        <div>
                            <FormattedNumber
                                value={price / 100}
                                style='currency'
                                currency={this.context.culture.currency}
                                minimumFractionDigits={2}
                                maximumFractionDigits={2}
                            />
                        </div>
                    </div>
                </Link>
                <div className='absolute right-0 top-0'>
                    <CloseIcon size={11} />
                </div>
            </div>
        )
    }
}