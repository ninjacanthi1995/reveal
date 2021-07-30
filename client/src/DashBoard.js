import React from 'react';
import Navbar from '../src/component/Navbar';
import { Table, Space, Button , Switch } from 'antd';
import {Link} from 'react-router-dom';




export default function DashBoard() {

    function onChange(checked) {
        console.log(`switch to ${checked}`);
      }


const MyButton = () => {
      return <Button className= 'Button-connect'  style={{marginLeft:20, marginBottom:10, borderRadius:6, fontWeight: "bold"}}> +Ajouter un modele</Button>
  }
  
  
      return (
        <>
        <Navbar/>
            <h1>Dashboard</h1>

        <div style={{marginTop : 100}}>
            <div className="dashboard" style={{marginTop : 20}} ><Switch defaultChecked onChange={onChange} />
            <Link to="/creer-mon-template" >Creer votre premier diplome</Link></div>
            <div className="dashboard" style={{marginTop : 20}}><Switch defaultChecked onChange={onChange} />
            <Link to="/creer-mon-template" >Importez vos diplomes</Link></div>
            <div className="dashboard" style={{marginTop : 20}}><Switch defaultChecked onChange={onChange} />
            <Link to="/creer-mon-template" >Envoyer les diplomes aux eleves</Link></div>
        </div> 
            
            </>
         
    );
  }