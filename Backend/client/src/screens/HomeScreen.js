import React, { useEffect, useState, useRef, useReducer, useContext } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../Components/Product";
import { Helmet } from "react-helmet-async";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import { Store } from "../utils/StoreProvider";
import { Navigate, useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    loading: "true",
    products: [],
    error: "",
  });
  const { state: ctxstate, dispatch: ctxDispatch } = useContext(Store);
  const{userInfo}=ctxstate
  const navigate = useNavigate();
  // const [products, setProducts] = useState([]);
  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if(!userInfo){
      navigate("/signin")
    }
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data); // because axios returns a object with config,data,headers,request,status
      // for a axios api request
    };
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();
  }, [userInfo,navigate]);
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h4 className="font-weight-bold">FEATURED PRODUCTS</h4>
      <div className="products ">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error variant={"danger"} message={error}>
            {error}
          </Error>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
