import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import studentList from './reducers/studentList.reducer';
import templateElements from './reducers/templateElements.reducer';

import ScreenHome from './ScreenHome';
import ImportStudentScreen from './component/ImportStudentScreen';
import ImportConfigScreen from './component/ImportConfigScreen';
import TemplateCreator from './component/TemplateCreator';
import CreateDiplomas from './component/CreateDiplomas';
import NotFoundPAge from './NotFoundPage';
import NewUserRequest from './NewUserRequest';

const store = createStore(combineReducers({studentList, templateElements}));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={ScreenHome} />
          <Route exact path="/NewUserRequest" component={NewUserRequest} />
          <Route exact path="/import" component={ImportStudentScreen} />
          <Route exact path="/import-config" component={ImportConfigScreen} />
          <Route exact path="/create-diplomas" component={CreateDiplomas} />
          <Route path="/creer-mon-template" component={TemplateCreator}  />
          <Route component={NotFoundPAge} />
        </Switch>
      </Router>
    </Provider>
  );
}



export default App;
