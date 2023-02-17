import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import { Store } from "../utils/StoreProvider";
import { getError } from "../utils/Utils";
import Error from "../Components/Error";

export default function AllOrdersList() {
  const { state: ctxState, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = ctxState;
  const reducer = (state, action) => {
    switch (action.type) {
      case "ORDERLIST_REQUEST":
        return {
          ...state,
          loading: true,
        };
      case "ORDERLIST_SUCCESS":
        return {
          ...state,
          orderList: action.payload,
          loading: false,
        };
      case "ORDERLIST_FAIL":
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };

  const [{ loading, orderList, error }, dispatch] = useReducer(reducer, {
    loading: false,
    orderList: null,
    error: "",
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: "ORDERLIST_REQUEST" });
        const { data } = await axios.get("/api/orders", {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        });
        dispatch({ type: "ORDERLIST_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "ORDERLIST_FAIL", payload: getError(err) });
      }
    };
    fetchOrders();
  }, [userInfo]);
  return (
    <div>
      <Container>
        <h1 style={{ marginBottom: "30px" }}>
          All Orders for {userInfo.name.charAt(0).toUpperCase()}
          {userInfo.name.slice(1)}
        </h1>
        {error && <Error variant={"danger"}>{error}</Error>}
        {!error && orderList &&
          orderList.map((item) => (
            <ListGroup key={item._id} variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col md={2}>
                    {item.createdAt.split("T")[0]}
                  </Col>
                  <Col md={4}>
                    <Link style={{ textDecoration: "none" }} to={`/order/${item._id}`}>
                      {item._id}
                    </Link>
                  </Col>
                  <Col md={2}>
                    {" "}
                    Paid
                    {item.isPaid ? (
                      <input
                        style={{ marginLeft: "10px" }}
                        type="checkbox"
                        checked="true"
                        disabled="disabled"
                      />
                    ) : (
                      <input
                        style={{ marginLeft: "10px" }}
                        type="checkbox"
                        disabled="disabled"
                      />
                    )}
                  </Col>
                  <Col md={2}>
                    {" "}
                    Delivered
                    {item.isDelivered ? (
                      <input
                        style={{ marginLeft: "10px" }}
                        type="checkbox"
                        checked="true"
                        disabled="disabled"
                      />
                    ) : (
                      <input
                        style={{ marginLeft: "10px" }}
                        type="checkbox"
                        disabled="disabled"
                      />
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          ))}
      </Container>
    </div>
  );
}
