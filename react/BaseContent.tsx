import React, {
  FC,
  useEffect,
  Children,
  ReactElement,
  Fragment,
  memo,
} from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint, useTreePath, useRuntime } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartState } from './MinicartContext'
import styles from './styles.css'
import { mapCartItemToPixel } from './modules/pixelHelper'
import useDebouncedPush from './modules/debouncedPixelHook'
import CheckoutButton from './CheckoutButton'

interface Props {
  sideBarMode: boolean
  finishShoppingButtonLink: string
}

interface BlocksFromExtension {
  blockId: string
  extensionPointId: string
  children: boolean
}

const CSS_HANDLES = [
  'minicartContentContainer',
  'minicartProductListContainer',
  'minicartTitle',
  'minicartFooter',
] as const

// eslint-disable-next-line react/display-name
const MinicartHeader: FC<{ minicartTitleHandle: string }> = memo(
  ({ minicartTitleHandle }) => (
    <h3
      className={`${minicartTitleHandle} t-heading-3 mv2 ph4 ph6-l c-on-base`}
    >
      <FormattedMessage id="store/minicart.title" />
    </h3>
  )
)

const Content: FC<Props> = ({ finishShoppingButtonLink, children }) => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const push = useDebouncedPush()
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()
  const { extensions } = useRuntime()
  const { treePath } = useTreePath()

  useEffect(() => {
    if (loading) {
      return
    }

    push({
      event: 'cartChanged',
      items: orderForm.items.map(mapCartItemToPixel),
    })
  }, [push, loading, orderForm.items])

  const minicartContentClasses = `${handles.minicartContentContainer} ${
    variation === 'drawer' ? styles.drawerStyles : styles.popupStyles
  } flex flex-column justify-between`

  const minicartFooterClasses = `${handles.minicartFooter} ${
    variation === 'drawer' ? '' : 'pv3'
  } sticky`

  const isCartEmpty = !loading && orderForm.items.length === 0

  /**
   * The logic below is to check if the user provided the blocks
   * 'minicart-product-list' and 'minicart-summary' via 'blocks'
   * instead of 'children' in their implementation of 'minicart-base-content'.
   * The blocksFromUserImplementation variable represents the result of concatenating
   * the 'blocks' and the 'children' arrays from blocks.json.
   */
  const blocksFromUserImplementation = extensions[treePath].blocks
  const minicartBlocksFromUserImplementation = blocksFromUserImplementation.filter(
    (block: BlocksFromExtension) =>
      !block.children &&
      (block.extensionPointId === 'minicart-product-list' ||
        block.extensionPointId === 'minicart-summary')
  )
  const shouldRenderUsingBlocks =
    minicartBlocksFromUserImplementation.length === 2

  if (isCartEmpty) {
    return (
      <Fragment>
        <MinicartHeader minicartTitleHandle={handles.minicartTitle} />
        <ExtensionPoint id="minicart-empty-state" />
      </Fragment>
    )
  }

  if (shouldRenderUsingBlocks) {
    return (
      <div className={minicartContentClasses}>
        <div
          className={`w-100 h-100 overflow-y-auto ${handles.minicartProductListContainer}`}
        >
          <MinicartHeader minicartTitleHandle={handles.minicartTitle} />
          <ExtensionPoint id="minicart-product-list" />
        </div>
        <div className={minicartFooterClasses}>
          <ExtensionPoint id="minicart-summary" />
          <CheckoutButton finishShoppingButtonLink={finishShoppingButtonLink} />
        </div>
      </div>
    )
  }

  return (
    <div className={minicartContentClasses}>
      <MinicartHeader minicartTitleHandle={handles.minicartTitle} />
      {Children.map(children, child =>
        React.cloneElement(child as ReactElement, { renderAsChildren: true })
      )}
    </div>
  )
}

export default Content
