import type { NavigatorScreenParams } from '@react-navigation/native'

export const APP_ROUTES = {
  home: 'home',
  products: 'products',
  settings: 'settings',
} as const

export const ROOT_ROUTES = {
  mainTabs: 'mainTabs',
} as const

export const PRODUCT_ROUTES = {
  productsList: 'productsList',
  productDetails: 'productDetails',
  createProduct: 'createProduct',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]

export type AppTabsParamList = {
  [APP_ROUTES.home]: undefined
  [APP_ROUTES.products]: NavigatorScreenParams<ProductsStackParamList>
  [APP_ROUTES.settings]: undefined
}

export type RootStackParamList = {
  [ROOT_ROUTES.mainTabs]: NavigatorScreenParams<AppTabsParamList>
}

export type ProductsStackParamList = {
  [PRODUCT_ROUTES.productsList]: undefined
  [PRODUCT_ROUTES.productDetails]: { productId: string }
  [PRODUCT_ROUTES.createProduct]: undefined
}
