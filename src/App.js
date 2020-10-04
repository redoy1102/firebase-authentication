import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    password:'',
    email: ''
  })

  
  const handleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email
      }
      setUser(signedInUser);
      console.log(displayName, email);
      console.log(res);
    })
    //error handling
    .catch(err => {
      console.log(err);
      console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name:'',
        email:''
      }
      setUser(signedOutUser);
    })
    .catch(err => {
      console.log(err);
    })
  }
//input field condition start
  const handleBlur = (event) => {
    let isFormValid = true;
    if(event.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }

    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber
    }
    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }
//input field condition end

//submitting handle start
  const handleSubmit = (event) => {
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ...
      });
    }
    event.preventDefault();
  }
//submitting handle end

  return (
    <div>
      {
        user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button> : 
        <button onClick={handleSignIn} >Sign In</button>
      }
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your E-mail Address: {user.email}</p>
        </div>
      }
      <h1>Our Own Authentication</h1>
      <p>Name: {user.name}</p>
      <p>E-mail: {user.email}</p>
      <p>Password: {user.password}</p>

      <form onSubmit = {handleSubmit}>
        <input name="name" onBlur={handleBlur} placeholder="Your Name" type="text"/>
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your E-mail Address" required />
        <br/>
        <input type="text" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

export default App;
