import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
//import Home from './component/Home'
import ScreenHome from './ScreenHome';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ScreenHome} />
        {/* <Route path="/products" component={Products}  /> */}
      </Switch>
    </Router>
  );
}



export default App;
