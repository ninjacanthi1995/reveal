import React, {useState} from 'react';
import './App.css';
import {Input,Button} from 'antd';
import {Redirect} from 'react-router-dom';


function ScreenHome() {

    //definition de tous les etats aux inputs de sign-in
const [userExists, setUserExists] = useState(false)
const [signInEmail,setSignInEmail] = useState('')
const [signInPassword,setSignInPassword] = useState('')


const [listErrorsSignin, setErrorsSignin] = useState([])
 


var handleSubmitSignin = async () => {
 
    const data = await fetch('/users/sign-in', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`
})

    const body = await data.json()

    if(body.result === true){
    setUserExists(true)
    }  else {
        setErrorsSignin(body.error)
    }
  }

  if(userExists){
    return <Redirect to='/' />
  }

  listErrorsSignin.map((error,i) => {
    return(<p>{error}</p>)
  })

  

    return (
    <div className= "Login-page" >

            {/* SIGN-IN */}

            <div className="Sign" >

                    <Input onchange= {(e) => setSignInEmail(e.target.value)} className="Login-input" placeholder="votre adresse email" />

                    <Input.Password onchange={(e) => setSignInPassword(e.target.value)} className="Login-input" placeholder="password" />


            <Button onClick={() => handleSubmitSignin() }  style={{width:'90px'}} type="primary">Login</Button>
            
            </div>



        </div>
    );
    }

    export default ScreenHome;
