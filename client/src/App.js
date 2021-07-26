import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import studentList from './reducers/studentList.reducer';

import ScreenHome from './ScreenHome';
import ImportStudentScreen from './component/ImportStudentScreen';
import ImportConfigScreen from './component/ImportConfigScreen';
import TemplateCreator from './component/TemplateCreator';
import CreateDiplomas from './component/CreateDiplomas';


const store = createStore(combineReducers({studentList}));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={ScreenHome} />
          <Route exact path="/import" component={ImportStudentScreen} />
          <Route exact path="/import-config" component={ImportConfigScreen} />
          <Route exact path="/create-diplomas" component={CreateDiplomas} />
          <Route path="/creer-mon-template" component={TemplateCreator}  />
          {/* <Route path="/products" component={Products}  /> */}
        </Switch>
      </Router>
    </Provider>
  );
}



export default App;
