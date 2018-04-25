import React from 'react'
import MiniCartButton from './MiniCartButton'

export default function HelloWorld() {
  return (
    <div className="relative">
      <div className="absolute right-0"><MiniCartButton labelButtonFinishShopping={'Finalizar Compra'} labelMiniCartEmpty={'Sua sacola está vazia!'} /></div>
    </div>
  )
}
