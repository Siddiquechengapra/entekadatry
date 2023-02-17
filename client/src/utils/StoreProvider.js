import React, { createContext, useReducer } from "react";
import logger from "use-reducer-logger";
import { toast } from "react-toastify";

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : null,
  },
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((x) => x._id === newItem._id);

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
          item._id === existItem._id ? newItem : item
        )
        : [...state.cart.cartItems, action.payload];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };

    case "REMOVE_FROM_CART":
      const itemToRemove = action.payload;
      const removedCart = state.cart.cartItems.filter(
        (item) => item._id !== itemToRemove._id
      );
      localStorage.setItem("cartItems", JSON.stringify(removedCart));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: removedCart,
        },
      };

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "USER_SIGNIN":
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      toast.success(
        `Welcome ${action.payload.name
          .charAt(0)
          .toUpperCase()}${action.payload.name.slice(1)}`
      );
      return {
        ...state,
        userInfo: action.payload,
      };

    case "USER_EDIT":
      const userinfoFromLocalStorage = JSON.parse(localStorage.getItem("userInfo"))
      const editedUser = { ...userinfoFromLocalStorage, name: action.payload.name, email: action.payload.email }
      localStorage.setItem("userInfo", JSON.stringify(editedUser));
      return {
        ...state,
        userInfo: { ...state.userInfo, ...editedUser }
      }

    case "USER_SIGNOUT":
      toast.warning(`Signed out`);

      return {
        ...state,
        userInfo: null,
        cart: {
          ...state.cart,
          cartItems: [],
          shippingAddress: {},
        },
      };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case "SAVE_PAYMENT_METHOD":
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

export const Store = createContext();

export default function StoreProvider(props) {
  const [state, dispatch] = useReducer(logger(reducer), initialState); //with logger
  // const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
