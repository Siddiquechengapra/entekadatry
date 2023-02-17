import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../utils/StoreProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils/Utils";



export default function Profile() {
  const { search } = useLocation();
  const [edit, setEdit] = useState(false);
  const { state: ctxstate, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = ctxstate
  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.email);
  const [emailToChange, setEmailToChange] = useState(userInfo?.email);
  const [pwdToChange, setPwdToChange] = useState("");
  const [confirmpwdToChange, setConfirmpwdToChange] = useState("");

  const navigate = useNavigate();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    if (pwdToChange === confirmpwdToChange) {
      try {
        const { data } = await axios.put("/api/profileedit", {
          name,
          email,
          emailToChange,
          pwdToChange
        }, {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        });

        ctxDispatch({ type: "USER_EDIT", payload: data });
        toast.success("Profile edited");
        setEdit(!edit)
      } catch (err) {
        toast.error(getError(err.response.data));
      }
    } else {
      toast.error("Passwords donot match  ");
    }


  };

  const onEdit = () => {
    setEdit(!edit)
  }
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin")
    }
  }, [userInfo, navigate,])


  return (
    <div className="signin">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1>User Profile</h1>
      {!edit &&
        <Form >
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              required
              value={userInfo.name}
              disabled={true}
            />
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              value={userInfo.email}
              disabled={true}
            />
            <Button className="mt-3" onClick={onEdit}>
              Edit
            </Button>
          </Form.Group>
        </Form>}
      {edit &&
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Label>Email</Form.Label>

            <Form.Control
              value={emailToChange}
              required
              onChange={(e) => setEmailToChange(e.target.value)}
            />
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              value={pwdToChange}
              required
              onChange={(e) => setPwdToChange(e.target.value)}
            />
            <Form.Label>Confirm password</Form.Label>

            <Form.Control
              type="password"
              value={confirmpwdToChange}
              required
              onChange={(e) => setConfirmpwdToChange(e.target.value)}
            />

            <Button className="mt-3" type="submit" >
              Update
            </Button>
          </Form.Group>
        </Form>}
    </div>
  );
}
