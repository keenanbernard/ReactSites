import React from "react";
import {Form} from "react-bootstrap";
import FormMessage from "./FormMessage";

const FormCategories = (props) => {

  return (
    <div hidden={props.hidden}>
      <Form.Check type={props.type} id={props.id}>
        <Form.Check.Input type={props.type} name={props.name} value={props.value} onChange={props.onChange}/>
        <Form.Check.Label hidden={props.hidden}><span style={{fontWeight: "bold"}}><span className='nomCategory'>{props.corpTrait}</span></span> <FormMessage><span className='nomTextInfo'>{props.message}</span></FormMessage>  </Form.Check.Label>
      </Form.Check>
      <p></p>

    </div>
  )

}

export default FormCategories