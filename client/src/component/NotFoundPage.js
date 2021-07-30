import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';




export default function NotFoundPAge() {

    return (
        <div className="Login-page">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1>Désolé, la page est introuvable</h1>
                <Link to="/">Retour à la page de connexion</Link>
            </div>
        </div>
    );
}



