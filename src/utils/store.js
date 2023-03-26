import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  saveItem: [],
  cart: { cartItems: [], shippingAddress: {} },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      console.log('CART_ADD_ITEM');
      const newItem = action.payload;

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: newItem,
          // shippingAddress: state.cart.shippingAddress,
        },
      };
    }

    case 'SAVE_ITEM': {
      console.log('SAVE_ITEM');
      return {
        ...state,
        saveItem: action.payload,
      };
    }
    case 'REMOVE_ITEM': {
      console.log('REMOVE_ITEM');
      // const cartItems = state.cart.cartItems.filter(
      //   (item) => item.slug !== action.payload.slug
      // );
      const cartItems = action.payload;
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_CLEAR_ITEMS':
      console.log('CART_CLEAR_ITEMS');
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    case 'CART_RESET':
      console.log('CART_RESET');
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      console.log('SAVE_SHIPPING_ADDRESS');
      return {
        ...state,
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
