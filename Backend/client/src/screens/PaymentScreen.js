import React, { useContext, useEffect, useState } from 'react'
import CheckoutSteps from '../Components/CheckoutSteps'
import Form from 'react-bootstrap/esm/Form'
import { useNavigate } from 'react-router-dom';
import { Store } from '../utils/StoreProvider';
import Button from 'react-bootstrap/esm/Button';


export default function PaymentScreen() {
  const { state: ctxstate, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { shippingAddress, paymentMethod } } = ctxstate

  const [paymentMethodSt, setPaymentMethodSt] = useState(paymentMethod || '')

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({type:"SAVE_PAYMENT_METHOD",payload:paymentMethodSt})
    localStorage.setItem("paymentMethod",JSON.stringify(paymentMethodSt))
    navigate("/placeorder")
  }

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping")
    }
  }, [])
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container ">
        <h3>Payment Method</h3>
        <Form onSubmit={submitHandler}>
          <Form.Check type="radio" id="paypal" label="Paypal" value="Paypal" checked={paymentMethodSt === 'Paypal'} onChange={(e) => setPaymentMethodSt(e.target.value)} />
          <Form.Check type="radio" id="stripe" label="Stripe" value="Stripe" checked={paymentMethodSt === 'Stripe'} onChange={(e) => setPaymentMethodSt(e.target.value)} />
          <Button type="submit">Continue</Button>
        </Form>
      </div></div>
  )
}