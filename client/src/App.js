import React from 'react';
import './App.less';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import studentList from './reducers/studentList.reducer';
import templateElements from './reducers/templateElements.reducer';
import requiredElements from './reducers/requiredElements.reducer';


import ScreenHome from './component/ScreenHome';
import ImportStudentScreen from './component/ImportStudentScreen';
import ImportConfigScreen from './component/ImportConfigScreen';
import DiplomaListScreen from './component/DiplomaListScreen';
import TemplateCreator from './component/TemplateCreator';
import CreateBatch from './component/CreateBatch';
import StudentDiploma from './component/StudentDiploma';
import NotFoundPAge from './component/NotFoundPage';
import NewUserRequest from './component/NewUserRequest';
import SettingsScreen from './component/SettingsScreen';
import TemplateManagement from './component/TemplateManagement';
import DashBoard from './component/DashBoard'
import ScreenDiplomaValidated from './component/ScreenDiplomaValidated';
import ScreenDiplomaError from './component/ScreenDiplomaError';
const store = createStore(combineReducers({studentList, templateElements, requiredElements}));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={ScreenHome} />
          <Route exact path="/dashboard" component={DashBoard} />
          <Route exact path="/dashboard/:tab" component={DashBoard} />
          <Route exact path="/new-user-request" component={NewUserRequest} />
          <Route exact path="/template-management" component={TemplateManagement} />
          <Route exact path="/import" component={ImportStudentScreen} />
          <Route exact path="/import-config" component={ImportConfigScreen} />
          <Route path="/diploma-list" component={DiplomaListScreen}  />
          <Route exact path="/create-batch" component={CreateBatch} />
          <Route path="/creer-mon-template/:template_name_params" component={TemplateCreator} />
          <Route path="/creer-mon-template" component={TemplateCreator} />
          <Route exact path="/diploma-student/:studentId/:batchId" component={StudentDiploma} />
          <Route exact path="/settings/:tab" component={SettingsScreen} />
          <Route exact path="/diploma-validated/:id_student/:id_diploma" component={ScreenDiplomaValidated} />
          <Route exact path="/diploma-error/:id_student/:id_diploma" component={ScreenDiplomaError} />
          <Route component={NotFoundPAge} />
        </Switch>
      </Router>
    </Provider>
  );
}



export default App;
