import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";

import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropDown from "react-bootstrap/NavDropDown";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import { Store } from "./utils/StoreProvider";
import Badge from "react-bootstrap/Badge";
import CartScreen from "./screens/CartScreen";
import Signin from "./screens/Signin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddress from "./screens/ShippingAddress";
import PaymentScreen from "./screens/PaymentScreen";
import SignUp from "./screens/SignUp";
import PlaceOrder from "./screens/PlaceOrder";
import OrderScreen from "./screens/OrderScreen";
import AllOrdersList from "./screens/AllOrdersList";
import Profile from "./screens/Profile";

function App() {
  const { state: ctxState, dispatch: ctxDispath } = useContext(Store);
  const { userInfo } = ctxState;
  const signoutHandler = () => {
    ctxDispath({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin"
  };

  return (
    <BrowserRouter>
      <div className=" d-flex flex-column site-container">
        <ToastContainer position={"bottom-center"} limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Entekada</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="me-auto w-100 justify-content-end">
                  <Nav.Link href="/cart">
                    Cart
                    <Badge pill bg="danger">
                      {ctxState?.cart?.cartItems?.length === 0
                        ? ""
                        : ctxState?.cart?.cartItems?.reduce(
                          (a, c) => a + c.quantity,
                          0
                        )}
                    </Badge>
                  </Nav.Link>
                  {userInfo ? (
                    <NavDropDown
                      title={`${userInfo.name.charAt(0).toUpperCase() +
                        userInfo.name.substring(1)
                        }`}
                      id="basic-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropDown.Item>User Profile</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orders">
                        <NavDropDown.Item>Order History</NavDropDown.Item>
                      </LinkContainer>
                      <NavDropDown.Divider />
                      <Link className="dropdown-item" onClick={signoutHandler}>
                        SignOut
                      </Link>
                    </NavDropDown>
                  ) : (
                    <Nav.Link href="/signin">Sign in </Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/shipping" element={<ShippingAddress />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orders" element={<AllOrdersList />} />
              <Route path="/profile" element={<Profile />} />

            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved </div>
        </footer>
      </div>
    </BrowserRouter >
  );
}

export default App;
