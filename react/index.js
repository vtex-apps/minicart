import React from 'react'
import MiniCartButton from './MiniCartButton'

export default function HelloWorld() {
  return (
    <div className="relative w-100 bg-red h6">
      <div className="absolute right-0 mr6"><MiniCartButton labelButtonFinishShopping={'Finalizar Compra'} labelMiniCartEmpty={'Sua sacola está vazia!'} /></div>
    </div>
  )
}
