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
    </div>
  );
}

export default App;
