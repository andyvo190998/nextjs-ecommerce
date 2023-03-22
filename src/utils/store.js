import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export const Store = createContext();

const initialState = {
  //cookies save data is string and json.parse convert cookies into json
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : { cartItems: [], shippingAddress: {} },
};
// const initialState = {
//   cart: { cartItems: [], shippingAddress: {} },
// };

const reducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;

      // const existItem = state.cart.cartItems.find(
      //   (item) => item.slug === newItem.slug
      // );
      // const cartItems = existItem
      //   ? state.cart.cartItems.map((item) =>
      //       item.name === existItem.name ? newItem : item
      //     )
      //   : [...state.cart.cartItems, newItem];
      Cookies.set('cart', JSON.stringify({ newItem }));
      return { cart: { cartItems: newItem, shippingAddress: {} } };
    }
    case 'REMOVE_ITEM': {
      // const cartItems = state.cart.cartItems.filter(
      //   (item) => item.slug !== action.payload.slug
      // );
      const cartItems = action.payload;
      Cookies.set('cart', JSON.stringify({ cartItems }));
      return { cart: { cartItems } };
    }

    case 'CART_CLEAR_ITEMS':
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    case 'CART_RESET':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    default:
      return state;
  }
};
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
