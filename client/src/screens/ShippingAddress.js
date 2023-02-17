import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../Components/CheckoutSteps'
import { Store } from '../utils/StoreProvider'

export default function ShippingAddress() {
    const { state: ctxstate, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo, cart: { shippingAddress } } = ctxstate
    const [fullname, setFullname] = useState(shippingAddress?.fullname || "")
    const [address, setAddress] = useState(shippingAddress?.address || "")
    const [city, setCity] = useState(shippingAddress?.city || "")
    const [postalcode, setPostalcode] = useState(shippingAddress?.postalcode || "")
    const [country, setCountry] = useState(shippingAddress?.country || "")
    const navigate = useNavigate();


    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: "SAVE_SHIPPING_ADDRESS", payload: {
                fullname, address, city, postalcode, country
            }
        })
        localStorage.setItem("shippingAddress", JSON.stringify({
            fullname, address, city, postalcode, country
        }))

        navigate("/payment")
    }

    useEffect(() => {
        if (!userInfo) {
            navigate("/signin?redirect=/shipping")
        }
    }, [userInfo,navigate])
    return (
        <div>
            <Helmet><title>ShippingAddress</title></Helmet>
            <CheckoutSteps step1 step2/>
            <div className='container small-container'>
                <h1 className='my-3'>ShippingAddress</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='mb-3' controlId="fullname">
                        <Form.Label>Fullname</Form.Label>
                        <Form.Control value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control value={city} onChange={(e) => setCity(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="postalcode">
                        <Form.Label>Postalcode</Form.Label>
                        <Form.Control value={postalcode} onChange={(e) => setPostalcode(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </Form.Group>
                    <div className='mb-3'>
                        <Button variant="primary" type="submit">Continue</Button>

                    </div>

                </Form>
            </div>

        </div>

    )
}