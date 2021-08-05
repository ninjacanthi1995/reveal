import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import '../App.less';

import DashBoardAdmin from './DashBoardAdmin';

export default function DashBoard() {
    const [IsAdmin, setIsAdmin] = useState(false)
    useEffect(() => {
        const user =JSON.parse(window.localStorage.getItem('user'))
        if (user.role === "admin") {
          setIsAdmin(true)
        }
    }, [])
    
    if (IsAdmin) return <DashBoardAdmin />

    return (
        <>
            <Navbar />
            <div>
                <div className="dashboard-page" style={{ backgroundImage: "url('/dashboard2.png')", opacity: "75%" }}>
                    <div>
                        <h1 className="dashboard-h1" >Dashboard</h1>
                        <div style={{ marginTop: 40 }}>
                            <Link to="/creer-mon-template" style={{ fontWeight: "bold", fontSize: '1.2em' }}>1/ Créer votre premier diplôme</Link>
                            <Link to="/create-batch" style={{ marginTop: 40, fontWeight: "bold", fontSize: '1.2em' }}>2/ Créer votre premier batch</Link>
                            <Link to="/import" style={{ marginTop: 40, marginRight: 30, fontWeight: "bold", fontSize: '1.2em' }}>3/ Importer mes élèves 🎉</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>




    );
}