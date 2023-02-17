import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";
import { Store } from "../utils/StoreProvider";
import axios from "axios";

export default function Product(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (product) => {
    const existItem = cartItems.find((item) => item.__id === product._id);
    const quantity = existItem ? existItem.quantity : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("out of stock");
      return;
    }

    ctxDispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
  };
  const { product } = props;
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <div className="prodinfo">
          <Link to={`/product/${product.slug}`}>
            <Card.Title>{product.name}</Card.Title>
          </Link>
          <Rating numReviews={product.numReviews} rating={product.rating} />
          <Card.Text>${product.price}</Card.Text>
          <div className="d-grid">
            {product.countInStock === 0 ? (
              <Button varinat="light" disabled>
                Out of stock
              </Button>
            ) : (
              <Button onClick={() => addToCartHandler(product)}>
                Add to cart
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
