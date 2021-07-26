import React, {useState} from 'react';
import './App.css';
import {Input,Button} from 'antd';
import {Link, Redirect} from 'react-router-dom';

function ScreenHome() {

    //definition de tous les etats aux input de sign-in
const [SignInEmail,setSignInEmail] = useState('')
const [SignInPassword,setSignInPassword] = useState('')

const [SignInError, setSignInError] = useState([])


    return (
    <div className="Login-page" >

            {/* SIGN-IN */}

            <div className="Sign" >

                    <Input className="Login-input" placeholder="toto@harvard.com" />

                    <Input.Password className="Login-input" placeholder="password" />


            <Button style={{width:'90px'}} type="primary">Login</Button>

            </div>



        </div>
    );
    }

    export default ScreenHome;
