import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './component/Home'
import TemplateCreator from './component/TemplateCreator'
import CreateDiplomas from './component/CreateDiplomas';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create-diplomas" component={CreateDiplomas} />
        <Route path="/creer-mon-template" component={TemplateCreator}  />
        {/* <Route path="/products" component={Products}  /> */}
      </Switch>
    </Router>
  );
}



export default App;
