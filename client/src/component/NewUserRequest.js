import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';




export default function NewUserRequest() {



    return (
        <div>
            <div className="header"  >
                <Link to="/"><img src="/reveal.png" style={{ height: 80, margin: 10, marginLeft: 30 }} alt="Reveal" /></Link>
            </div>
            <div className="Subscribe-page">
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h1>DEMANDE D'INSCRIPTION</h1>
                    <Link to="/">Retour à la page de connexion</Link>
                </div>
            </div>
        </div>
    );
}
