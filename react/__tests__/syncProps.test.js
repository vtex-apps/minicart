import { pickAddProps, pickUpdateProps } from '../index'

// These two field lists decide what the v1 minicart forwards to the server. The
// asymmetry is deliberate: `priceToken` rides along on add, which is the
// mutation that honours it, and not on update, which reprices a line already in
// the cart — confirmed against the Checkout REST API, where `POST /items/update`
// leaves the price untouched when a token is sent.

const item = {
  id: '35',
  index: 0,
  quantity: 1,
  seller: '1',
  options: [],
  // Fields the local minicart state carries but the server must not receive.
  sellingPrice: 9990,
  skuName: 'Classic Shoes',
  cartIndex: 2,
}

describe('what the minicart forwards on add', () => {
  it('carries the priceToken', () => {
    const [sent] = pickAddProps([{ ...item, priceToken: 'signed.price.token' }])

    expect(sent.priceToken).toBe('signed.price.token')
  })

  it('forwards only the fields the mutation declares', () => {
    const [sent] = pickAddProps([{ ...item, priceToken: 'signed.price.token' }])

    expect(Object.keys(sent).sort()).toEqual(
      ['id', 'index', 'options', 'priceToken', 'quantity', 'seller'].sort()
    )
  })

  // `pick` keys off key existence, not value, so an item carrying an explicit
  // `priceToken: null` would forward that null into the mutation variables.
  // Asserting on key absence rather than on value is what catches it.
  it('omits the key when the item has no token', () => {
    const [sent] = pickAddProps([item])

    expect('priceToken' in sent).toBe(false)
  })

  it('forwards null as null when the item carries one', () => {
    const [sent] = pickAddProps([{ ...item, priceToken: null }])

    // Documents the dependency's behaviour: the guard therefore belongs
    // upstream, where the field enters the item (store-components' BuyButton).
    expect('priceToken' in sent).toBe(true)
    expect(sent.priceToken).toBeNull()
  })
})

describe('what the minicart forwards on update', () => {
  it('never carries the priceToken', () => {
    const [sent] = pickUpdateProps([
      { ...item, priceToken: 'signed.price.token' },
    ])

    expect('priceToken' in sent).toBe(false)
  })

  it('forwards the same fields as add, minus the token', () => {
    const [onAdd] = pickAddProps([{ ...item, priceToken: 'tok' }])
    const [onUpdate] = pickUpdateProps([{ ...item, priceToken: 'tok' }])

    expect(Object.keys(onUpdate).sort()).toEqual(
      Object.keys(onAdd)
        .filter(k => k !== 'priceToken')
        .sort()
    )
  })
})
