import React, { useReducer, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import Rating from "../Components/Rating";
import Loading from "../Components/Loading";
import Error from "../Components/Error";

import { getError } from "../utils/Utils";
import { Store } from "../utils/StoreProvider";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {
  const navigate = useNavigate();
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    product: [],
  });
  const params = useParams();
  const { slug } = params;
  const dataFetcherRef = useRef(false);
  const { state: ctxState, dispatch: ctxDispatch } = useContext(Store);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const result = await axios.get(`/api/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        dataFetcherRef.current = true;
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (dataFetcherRef.current) return;
    dataFetcherRef.current = true;
    fetchData();
  }, [slug]);

  const addToCartHandler = async (product) => {
    const existItem = ctxState.cart.cartItems.find(
      (x) => x._id === product._id
    );

    const quantity = existItem
      ? (existItem.quantity = existItem.quantity + 1)
      : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      alert("product out of stock");
      return;
    }
    ctxDispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };
  const removeFromCartHandler = async (product) => {
    ctxDispatch({ type: "REMOVE_FROM_CART", payload: { ...product } });
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <Error variant="warning" message={error} />
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img src={product.image} alt={product.name} className="img-large" />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating numReviews={product.numReviews} rating={product.rating} />
            </ListGroup.Item>
            <ListGroup.Item>Price:${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price</Col>
                    <Col>{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In stock</Badge>
                      ) : (
                        <Badge bg="danger">Out of stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    {/* dgrid is for stretching the add to cart button  */}
                    <div className="d-grid">
                      {!ctxState.cart.cartItems.find(
                        (x) => x._id === product._id
                      ) && <Button
                        onClick={() => addToCartHandler(product)}
                        variant="primary"
                      >
                          Add to cart
                        </Button>}

                      {ctxState.cart.cartItems.find(
                        (x) => x._id === product._id
                      ) && (
                          <Button
                            onClick={() => removeFromCartHandler(product)}
                            className="mt-1"
                            variant="warning"
                          >
                            Remove from cart
                          </Button>
                        )}
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
