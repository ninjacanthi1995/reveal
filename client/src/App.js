import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './component/Home'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/products" component={Products}  /> */}
      </Switch>
    </Router>
  );
}



export default App;
