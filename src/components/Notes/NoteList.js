import React from "react";

import "./NoteList.css";

const noteList = (props) => {
  console.log("RENDERING noteLIST");
  return (
    <section className="notes">
      <h2>Loaded notes</h2>
      <div className="note-items">
        {props.notes.map((ig) => (
          <div className="note-item" key={ig.id}>
            <h3>{ig.title}</h3>
            <span id="delete-item" onClick={props.onRemoveItem.bind(this, ig.id)}>X</span>
            <p>{ig.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default noteList;
