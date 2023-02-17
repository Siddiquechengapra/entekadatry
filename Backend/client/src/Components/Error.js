import React from "react";
import Alert from "react-bootstrap/Alert";

export default function Error(props) {
  return (
    <Alert variant={props.variant}>
      {props.message} {props.children}
    </Alert>
  );
}
