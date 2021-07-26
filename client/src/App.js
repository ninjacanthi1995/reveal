import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import studentList from './reducers/studentList.reducer';

import Home from './component/Home';
import ImportStudentScreen from './component/ImportStudentScreen';
import ImportConfigScreen from './component/ImportConfigScreen';

const store = createStore(combineReducers({studentList}));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/import" component={ImportStudentScreen} />
          <Route exact path="/import-config" component={ImportConfigScreen} />
          {/* <Route path="/products" component={Products}  /> */}
        </Switch>
      </Router>
    </Provider>
  );
}



export default App;
