import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import ErrorModal from "../UI/ErrorModal";

import useHttp from "../../hooks/http";

const noteReducer = (currentnotes, action) => {
  switch (action.type) {
    case "SET":
      return action.notes;
    case "ADD":
      return [...currentnotes, action.note];
    case "DELETE":
      return currentnotes.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const Notes = () => {
  const [usernotes, dispatch] = useReducer(noteReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifer, clear } =
    useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === "REMOVE_NOTE") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === "ADD_NOTE") {
      dispatch({
        type: "ADD",
        note: { id: data.name, ...reqExtra },
      });
    } else if (!isLoading && !error && reqIdentifer === "SET_NOTES") {
      let fetchedOrders = [];
      for (let key in data) {
        fetchedOrders.push({
          ...data[key],
          id: key,
        });
      }
      dispatch({ type: "SET", notes: fetchedOrders });
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  useEffect(() => {
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    const queryParams =
      "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';

    let url =
      "https://remote-todo-list-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json" +
      queryParams;

    sendRequest(url, "GET", null, null, "SET_NOTES");
  }, [sendRequest]);

  const addnoteHandler = useCallback(
    (note) => {
      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");

      sendRequest(
        "https://remote-todo-list-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json?auth=" +
          token,
        "POST",
        JSON.stringify({ ...note, userId: userId }),
        { ...note, userId: userId },
        "ADD_NOTE"
      );
    },
    [sendRequest]
  );

  const removenoteHandler = useCallback(
    (noteId) => {
      let token = localStorage.getItem("token");
      sendRequest(
        `https://remote-todo-list-default-rtdb.asia-southeast1.firebasedatabase.app/todos/${noteId}.json?auth=` +
          token,
        "DELETE",
        null,
        noteId,
        "REMOVE_NOTE"
      );
    },
    [sendRequest]
  );

  const signOutHandler = (event) => {
    event.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const noteList = useMemo(() => {
    return <NoteList notes={usernotes} onRemoveItem={removenoteHandler} />;
  }, [usernotes, removenoteHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <NoteForm
        onAddnote={addnoteHandler}
        loading={isLoading}
        signOut={signOutHandler}
      />
      {noteList}
    </div>
  );
};

export default Notes;

