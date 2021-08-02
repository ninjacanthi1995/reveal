import React from 'react';
import Navbar from './Navbar';
import { Switch } from 'antd';
import{ Link , Redirect} from 'react-router-dom';
import '../App.css';
import { useEffect } from 'react';
import { Checkbox } from 'antd';

export default function DashBoardAdmin() {

    
    // useEffect(() => {
    //     const user =JSON.parse(window.localStorage.getItem('user'))
    //     if (user.admin === "admin") {
    //         return <Redirect to='/dashboard-admin' />
    //     }

    // }, [])


    // function onChange(checked) {
    //     console.log(`switch to ${checked}`);
    // }

    function onChange(e) {
        console.log(`checked = ${e.target.checked}`);
      }

    return (
        
        <>
            <Navbar />
            
        </>




    );
}