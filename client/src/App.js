import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './component/Home';
import CreateDiplomas from './component/CreateDiplomas';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create-diplomas" component={CreateDiplomas} />
      </Switch>
    </Router>
  );
}



export default App;
