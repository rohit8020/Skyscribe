import React, { useState } from "react";

import Card from "../UI/Card";
import LoadingIndicator from "../UI/LoadingIndicator";
import "./NoteForm.css";

const NoteForm = React.memo((props) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredDescription, setEnteredDescription] = useState("");
  console.log("RENDERING note FORM");

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddnote({ title: enteredTitle, description: enteredDescription});
  };

  return (
    <section className="note-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={(event) => {
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              id="desciption"
              value={enteredDescription}
              onChange={(event) => {
                setEnteredDescription(event.target.value);
              }}
            />
          </div>
          <div className="note-form__actions">
            <button type="submit">Add note</button>
            <button onClick={props.signOut}>SignOut</button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default NoteForm;
