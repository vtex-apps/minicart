interface PackagesSkuIds {
  data: {
    bagsSettings: {
      bioFlegBagId: string
      insulationBagId: string
      plasticBagId: string
      paperBagId: string
    }
    sgrSettings: {
      aluminumCanProducts: {
        label: string
        skuIds: string[]
      }
      glassBottleProducts: {
        label: string
        skuIds: string[]
      }
      plasticBottleProducts: {
        label: string
        skuIds: string[]
      }
    }
  }
  error: null | string
}
