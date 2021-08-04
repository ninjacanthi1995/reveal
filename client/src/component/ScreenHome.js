import React, { useState, useEffect } from 'react';
import '../App.less';
import { Input, Button } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import { MailOutlined, LockOutlined } from '@ant-design/icons';



function ScreenHome() {

    //definition de tous les etats aux inputs de sign-in
    const [userExists, setUserExists] = useState(false)
    const [signInEmail, setSignInEmail] = useState('')
    const [signInPassword, setSignInPassword] = useState('')

    useEffect(() => {
        const user = window.localStorage.getItem('user')
        if (user) {
            setUserExists(true)
        }
    }, [])


    const [listErrorsSignin, setErrorsSignin] = useState([])

    var handleSubmitSignin = async () => {
        const data = await fetch('/users/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`
        })

        const body = await data.json()
        if (body.result === true) {
            setUserExists(true)
            window.localStorage.setItem('user', JSON.stringify({firstname: body.user.firstname, _id: body.user._id, role: body.user.role}))
            window.localStorage.setItem('school_id', body.user.school_id)
        } else {
            setErrorsSignin(body.error)
        }
    }

    if (userExists) {
        return <Redirect to='/dashboard' />
    }

    return (
        <div>
            <div className="header"  >
                <Link to="/template-management"><img src="/reveal.png" style={{ height: 80, margin: 10, marginLeft: 30 }} alt="Reveal" /></Link>
                <Link to="/new-user-request" style={{ height: 80, margin: 10, marginRight: 30 }}>Demander mon accès</Link>
            </div>
            <div className="Login-page" style={{ backgroundImage: "url('/backgroundColorReveal.png')", opacity: "75%" }}>
                {/* SIGN-IN */}
                <div className="Sign" >
                    <Input onChange={(e) => setSignInEmail(e.target.value)} className="Login-input" placeholder="votre adresse email" prefix={<MailOutlined style={{ fontSize: 20, color: 'grey' }} />} />
                    <Input.Password onChange={(e) => setSignInPassword(e.target.value)} className="Login-input" placeholder="password" prefix={<LockOutlined style={{ fontSize: 20, color: 'grey' }} />} />
                    {listErrorsSignin.map((error, i) => {
                        return (<p>{error}</p>)
                    })}
                    <Button className='Button-connect' onClick={() => handleSubmitSignin()} style={{ width: '90px' }} type="primary">Login</Button>
                </div>
            </div>
        </div>
    );
}


export default ScreenHome;
