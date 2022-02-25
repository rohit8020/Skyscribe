import React, { useContext } from "react";

import Notes from "./components/Notes/Notes";
import Auth from "./components/Auth";
import { AuthContext } from "./context/auth-context";

const App = (props) => {
  const authContext = useContext(AuthContext);

  let content = (<>
  <h1 style={
    {color: 'white',
    marginTop: "50px",
    textAlign: 'center',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 10,
    textShadowColor: 'blue',
    }
  }>
  Note Here Access Anywhere!
  </h1>
  <Auth />
  </>);
  let userId = localStorage.getItem("userId");
  let token = localStorage.getItem("token");
  if (authContext.isAuth || (userId && token)) {
    content = <Notes />;
  }

  return content;
};

export default App;
