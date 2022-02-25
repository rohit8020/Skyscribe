import React, { useContext, useCallback, useState } from 'react';

import Card from './UI/Card';
import { AuthContext } from '../context/auth-context';
import ErrorModal from '../components/UI/ErrorModal';

import './Auth.css';

const Auth = props => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const signinAndSignupHandler=(sign)=>{

      const authData = {
        email: email,
        password: password,
        returnSecureToken: true
      };
      let url=""
      if(sign==="signup"){
        url="https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key="+process.env.React_App_Auth_Key
      }
      if(sign==="signin"){
        url='https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key='+process.env.React_App_Auth_Key
      }

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(authData) 
      })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        if(responseData.error){
          setError(responseData.error.message)
        }else{
          if(sign==="signin"){
            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
            authContext.login();
          }
        }
      })
      .catch(error => {
        if(error){
          setError(error.message);
        }
      });
  };

  const loginHandler=()=>{
    signinAndSignupHandler("signin")
  }

  const signupHandler=()=>{
    signinAndSignupHandler("signup")
  }

  const clear=useCallback(()=>{
      setError(null);
      setEmail("");
      setPassword("");
  },[])

  return (
    <div className="auth">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <div className="input-container">
        <input onChange={(event)=>{setEmail(event.target.value)}} value={email} type="email" name="email"></input>
        <input onChange={(event)=>{setPassword(event.target.value)}} value={password} type="password" name="password"></input>
        </div>
        <div className="btn-container">
        <button onClick={loginHandler}>Log In</button>
        <button onClick={signupHandler}>Sign Up</button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
