import { environment } from "../environments/environment.development";

const baseUrl = environment.apiUrl;

export const API_ENDPOINTS = {
  products: {
    getAll:        `${baseUrl}/product`,           // GET with query params
    getById:       (id: number) => `${baseUrl}/product/${id}`,
    getStock:   (id: number) => `${baseUrl}/product/${id}/stock`,
  },
  categories: {
    getAll:        `${baseUrl}/category`,
    getById:       (id: number) => `${baseUrl}/category/${id}`,
  },
  cart: {
    getAll:        `${baseUrl}/cart`,
    addItem:       `${baseUrl}/cart/items`,
    removeItem:    (cartItemId: number) => `${baseUrl}/cart/items/${cartItemId}`,
    clear:         `${baseUrl}/cart`,
  },
  favorites: {
    toggle: (productId: number) => `${baseUrl}/favorite/toggle/${productId}`,
    check:  (productId: number) => `${baseUrl}/favorite/check/${productId}`,
    myList: `${baseUrl}/favorite/my-list`,
  },
  orders: {
    GetById:   (id: string | number) => `${baseUrl}/orders/${id}`,
    getAll:        `${baseUrl}/orders`,
    GetByUserId:    (userId: number) => `${baseUrl}/orders/user/${userId}`,
    Create:        `${baseUrl}/orders`,
    Update:   (id: string | number) => `${baseUrl}/orders/${id}`,
    Delete:   (id: string | number) => `${baseUrl}/orders/${id}`,
  },
  payment:{
       initiatePayment: `${baseUrl}/payment/initiate`
  },
  assetPrice:{
    getCurrentPrices: `${baseUrl}/asset-price/current`
  },
  deposit:{
    createDeposit: `${baseUrl}/deposit/initiate`
  },
  trade:{
    executeBuyTrade: `${baseUrl}/trade/buy`,
    executeSellTrade: `${baseUrl}/trade/sell`
  },
  Address:{
    getAll:        `${baseUrl}/address`,
    create:        `${baseUrl}/address`,
    delete:   (id: number) => `${baseUrl}/address/${id}`,
  },
  Delivery:{
    create:        `${baseUrl}/delivery`,
    getById:   (id: number) => `${baseUrl}/delivery/${id}`,
  }
};