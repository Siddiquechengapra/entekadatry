import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../utils/StoreProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils/Utils";



export default function SignUp() {
  const { search } = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const { state: ctxstate, dispatch: ctxDispatch } = useContext(Store);
  const {userInfo} =ctxstate
  const navigate = useNavigate();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmpassword){
      toast.error("Passwords do not match")
      return
    }
    try {
      const { data } = await axios.post("/api/user/signup", {
        name,
        email,
        password,
      });
      console.log("user created",data)
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
        <title>Sign Up </title>
      </Helmet>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
        <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            required
            onChange={(e) => setName(e.target.value)}
          />
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
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <Button className="mt-3" type="submit">
            Sign Up
          </Button>
          <div className="mb-3">
           Already have an account ? {""}{" "}
            <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}
