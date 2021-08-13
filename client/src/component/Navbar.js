import React, {useEffect, useState} from 'react'
import {useHistory, Link} from 'react-router-dom';
import { DashboardOutlined, LayoutOutlined, WalletOutlined, SettingOutlined } from '@ant-design/icons';

import colors from '../helpers/colors'

export default function Navbar() {
  const history = useHistory()
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(()=>{
    const user = JSON.parse(window.localStorage.getItem('user'))
      if(!user){
        history.push('/')
      }else if(user.role === "admin"){
        setIsAdmin(true)
      }
  }, [history])

  return (
    <>
      <div style={styles.navbar}>
        <Link to="/"><img src="/reveal.png" style={styles.logo} alt="Reveal" /></Link>
        <div style={{display:"flex"}}>
          {isAdmin && <Link to="/dashboard" style={styles.link}><DashboardOutlined style={{marginRight: 5}} />Dashboard</Link>}
          {!isAdmin && <Link to="/template-management" style={styles.link}><LayoutOutlined style={{marginRight: 5}} />Liste des templates</Link>}
          {!isAdmin && <Link to="/batch-list" style={styles.link}><LayoutOutlined style={{marginRight: 5}} />Liste des batches</Link>}
          {!isAdmin && <Link to="/diploma-list" style={styles.link}><WalletOutlined style={{marginRight: 5}} />Liste des diplômes</Link>}

          <Link to="/settings/account" style={styles.link}><SettingOutlined style={{marginRight: 5}} />Settings</Link>
        </div>
      </div>
      <div style={styles.navbarPadding}></div>
    </>
  )
}

const styles = {
  navbar:{
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100vw",
    padding: 30,
    backgroundColor: "white",
    borderBottom: `1px solid ${colors.gray}`
  },
  logo:{
    height: 50
  },
  link:{
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  navbarPadding:{
    width: "100vw",
    height: 110
  }
}
