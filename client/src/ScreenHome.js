import React, {useState} from 'react';
import './App.css';
import {Input,Button} from 'antd';
import {Redirect, Link} from 'react-router-dom';





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
console.log(body);
    if(body.result === true){
    setUserExists(true)
    }  else {
        setErrorsSignin(body.error)
    }
    }

    if(userExists){
    return <Redirect to='/create-diplomas'/>
    }

    



    return (
    <div>
        <div style={{display:'flex', flexDirection:'column' , justifyContent: 'center', alignItems:'flex-end', padding: "20px"}}>
                <Link to="/">Demander mon accès</Link>
            </div> 
                <h1>REVEAL</h1>

            <div className= "Login-page" style={{backgroundImage: "url('/backgroundColorReveal.png')"}}>

            {/* SIGN-IN */}

            <div className="Sign" >

                    <Input onChange= {(e) => setSignInEmail(e.target.value)} className="Login-input" placeholder="votre adresse email"  />

                    <Input.Password onChange={(e) => setSignInPassword(e.target.value)} className="Login-input" placeholder="password"  />
                    {listErrorsSignin.map((error,i) => {
                    return(<p>{error}</p>)
    })}
                    <Button onClick={() => handleSubmitSignin() } style={{width:'90px'}} type="primary">Login</Button>
            </div>

</div>

        </div>
    );
    }


    export default ScreenHome;
