import React from 'react'
import MiniCartButton from './MiniCartButton'

export default function HelloWorld() {
  const mock = {
    loading: false,
    orderForm: {
      items: [
        {
          id: '31',
          imageUrl: 'https://raw.githubusercontent.com/vtex-apps/product-summary/feature/product-image/images/500x500-img-pro20.png',
          name: 'Motorola celular Moto X4',
          quantity: 1,
          sellingPrice: 154000,
          skuName: 'Moto X4',
        },
        {
          id: '32',
          imageUrl: 'https://raw.githubusercontent.com/vtex-apps/product-summary/feature/product-image/images/500x500-img-pro5.png',
          name: 'Motorola celular Moto X4',
          quantity: 1,
          sellingPrice: 154000,
          skuName: 'Moto X4',
        },
        {
          id: '33',
          imageUrl: 'https://raw.githubusercontent.com/vtex-apps/product-summary/feature/product-image/images/500x500-img-pro8.png',
          name: 'Motorola celular Moto X4',
          quantity: 1,
          sellingPrice: 154000,
          skuName: 'Moto X4',
        },
      ],
      value: 1632000,
    },
  }

  console.log(mock)

  return (
    <div className="relative">
      <div className="absolute right-0"><MiniCartButton labelMiniCartEmpty={'Sua sacola está vazia!'} /></div>
    </div>
  )
}
