import React, { useContext } from "react";
import { Store } from "../utils/StoreProvider";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import Error from "../Components/Error";
import axios from "axios";

export default function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  const updateHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return; 
    }
    ctxDispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  const {
    cart: { cartItems },
  } = state;
  return (
    <div>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Error variant="danger" message="cart is empty">
              <Link to="/">Go shopping</Link>{" "}
            </Error>
          ) : (
            <Col>
              <ListGroup>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col>
                        <img
                          className="img-fluid img-thumbnail "
                          src={item.image}
                          alt={item.name}
                        ></img>{" "}
                      </Col>
                      <Col>
                        <Link
                          className="text-dark"
                          to={`/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col>
                        <Button
                          variant="light"
                          disabled={item.quantity === 1}
                          onClick={() => updateHandler(item, item.quantity - 1)}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>
                        {""}
                        <span>{item.quantity}</span>{" "}
                        <Button
                          variant="light"
                          disabled={item.quantity === item.countInStock}
                          onClick={() => updateHandler(item, item.quantity + 1)}
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </Col>
                      <Col>${item.price}</Col>
                      <Col>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="light"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Total quantities :{" "}
                  {cartItems.reduce((a, c) => a + c.quantity, 0)}
                </ListGroup.Item>
                <ListGroup.Item>
                  Total Price :{" "}
                  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
