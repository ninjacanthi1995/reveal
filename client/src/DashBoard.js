import React from 'react';
import Navbar from '../src/component/Navbar';
import { Switch , Checkbox , Button } from 'antd';
import {Link} from 'react-router-dom';
import './App.css';



export default function DashBoard() {

    function onChange(checked) {
        console.log(`switch to ${checked}`);
}




        return (
        <>
        <Navbar/>
        <div>
        
        <div className="dashboard-page" style={{backgroundImage: "url('/dashboard2.png')" , opacity: "75%"}}>
         <div>  
         <h1 className="dashboard-h1" >Dashboard</h1>
        <div style={{marginTop : 40}}>
            <div className="dashboard" style={{marginTop : 40 }} >
                <Link to="/creer-mon-template" style={{marginLeft : 200 ,fontWeight: "bold" , fontSize:'1.2em' }}>1/ Créer votre premier template</Link>
                <Switch defaultChecked onChange={onChange} style={{marginRight : 200 }}/>
            </div>
            <div className="dashboard" style={{marginTop : 40}}>
            <Link to="/create-batch" style={{marginLeft : 200, fontWeight: "bold", fontSize:'1.2em' }}>2/ Créer votre premier batch</Link>
                <Switch defaultChecked onChange={onChange} style={{marginRight : 200 }}/>
            </div>
            <div className="dashboard" style={{marginTop : 40}}>
            <Link to="/import" style={{marginLeft : 200, marginRight:30 , fontWeight: "bold", fontSize:'1.2em'}}>3/ Importer vos élèves</Link>
                <Switch defaultChecked onChange={onChange} style={{marginRight : 200 }}/>
            </div>
        </div>
        </div>
        </div>
        </div> 
        </>




    );
}