/* eslint-disable no-shadow */
const configs = { isMobile: false }

export const { isMobile } = configs

export const setMobile = isMobile => (configs.isMobile = isMobile)
