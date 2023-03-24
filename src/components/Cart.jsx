import React from 'react';

const Cart = (props) => {
  return (
    <div>
      {/* {props.name} */}
      <p>
        {props.cart.name} || Quantity: {props.cart.quantity}
      </p>
    </div>
  );
};

export default Cart;
