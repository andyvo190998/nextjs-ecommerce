import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const Store = createContext();

// const initialState = {
//   //cookies save data is string and json.parse convert cookies into json
//   cart: Cookies.get('cart')
//     ? JSON.parse(Cookies.get('cart'))
//     : { cartItems: [], shippingAddress: {} },
// };
const initialState = {
  cart: { cartItems: [], shippingAddress: {} },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      console.log('CART_ADD_ITEM');
      const newItem = action.payload;

      // const existItem = state.cart.cartItems.find(
      //   (item) => item.slug === newItem.slug
      // );
      // const cartItems = existItem
      //   ? state.cart.cartItems.map((item) =>
      //       item.name === existItem.name ? newItem : item
      //     )
      //   : [...state.cart.cartItems, newItem];
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: newItem,
          // shippingAddress: state.cart.shippingAddress,
        },
      };
    }
    case 'REMOVE_ITEM': {
      console.log('REMOVE_ITEM');
      // const cartItems = state.cart.cartItems.filter(
      //   (item) => item.slug !== action.payload.slug
      // );
      const cartItems = action.payload;
      Cookies.set('cart', JSON.stringify({ cartItems }));
      return { cart: { ...state.cart, cartItems } };
    }

    case 'CART_CLEAR_ITEMS':
      console.log('CART_CLEAR_ITEMS');
      return {
        cart: { ...state.cart, cartItems: [] },
      };
    case 'CART_RESET':
      console.log('CART_RESET');
      return {
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      console.log('SAVE_SHIPPING_ADDRESS');
      return {
        cart: {
          cartItems: state.cart.cartItems,
          shippingAddress:
            // ...state.cart.shippingAddress,
            action.payload,
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      console.log('SAVE_PAYMENT_METHOD');
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
