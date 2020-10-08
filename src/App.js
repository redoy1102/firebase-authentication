import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false, 
    email: '',
    password:''
    
  })

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email
      }
      setUser(signedInUser);
    })
    //error handling
    .catch(err => {
      console.log(err);
      console.log(err.message);
      })
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log(user);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name:'',
        email:'',
        error:'',
        success:false
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
    // console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo ={...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }

     if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo ={...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('Sign in user info', res.user);
      })
      .catch(error => { 
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    event.preventDefault();
  }
//submitting handle end

//Updating UserName Start

  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('User Name updated successfully')
    }).catch(function(error) {
      console.log(error)
    });
  }

  //Updating UserName End

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button> : 
        <button onClick={handleSignIn} >Sign In</button>
      }
      <br/>
      <button onClick={handleFbSignIn} >Sign in using Facebook</button>
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.email}</p>
          <p>Your E-mail Address: {user.email}</p>
        </div>
      }
      <h1>Our Own Authentication</h1>
       <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id=""/>
       <label htmlFor="newUser">New User Sign Up</label>
      
      <form onSubmit = {handleSubmit}>
        { newUser && <input name="name" onBlur={handleBlur} placeholder="Your Name" type="text"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your E-mail Address" required />
        <br/>
        <input type="text" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form> 
        <p style={{color:'red'}}>{user.error}</p>
        {user.success && <p style={{color:'green'}}>User {newUser ? 'Created': 'Logged In'} Successfully</p>}
    </div>
  ); 
}

export default App;
