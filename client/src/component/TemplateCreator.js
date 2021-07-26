import React from 'react'
import { Button } from 'antd';
import 'antd/dist/antd.css'

import colors from '../helpers/colors'
import Navbar from './Navbar'
import ToolBox from "./template/ToolBox"
import Displayer from "./template/Displayer"

export default function TemplateCreator() {
  return (
    <>
      <Navbar></Navbar>
      <div style={styles.templateBackground}>
        <ToolBox />
        <Displayer />
        <Button style={styles.saveButton} type="primary">Enregistrer mon template</Button>
      </div>
    </>
  )
}

const styles = {
  templateBackground:{
    backgroundColor: colors.templateBackground,
    height: 'calc(100vh - 110px)',
    padding: 30,
    position: "relative",
    overflowY: "scroll"
  },
  saveButton:{
    position: "fixed",
    bottom: 30,
    right: 30
  }
}
