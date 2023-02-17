import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../utils/StoreProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils/Utils";



export default function Signin() {
  const { search } = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state: ctxstate, dispatch: ctxDispatch } = useContext(Store);
  const {userInfo} =ctxstate
  const navigate = useNavigate();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN",payload:data});
      navigate(redirect);
    } catch (err) {
      toast.error(getError(err));
    }
  };



  useEffect(()=>{
    if(userInfo){
        navigate(redirect)
    }
  },[userInfo,navigate,redirect])

  return (
    <div className="signin">
      <Helmet>
        <title>Sign in</title>
      </Helmet>
      <h1>Sign in</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="mt-3" type="submit">
            Sign in
          </Button>
          <div className="mb-3">
            New customer ? {""}{" "}
            <Link to={`/signup?redirect=${redirect}`}>create your account</Link>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}
