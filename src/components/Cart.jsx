import React from 'react';

const Cart = (props) => {
  console.log(props.cart.name);
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
