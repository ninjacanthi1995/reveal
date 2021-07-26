import React from 'react';

const Displayer = () => {
  return (
    <div style={styles.displayer}>
      
    </div>
  );
}

const width = 70
const height = width/29.7*21

const styles = {
  displayer:{
    margin: "auto",
    width: `${width}vw`,
    height: `${height}vw`,
    backgroundColor: "white"
  }
}

export default Displayer;
