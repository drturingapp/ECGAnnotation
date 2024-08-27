import React from 'react';
import { Route } from 'react-router';

/**
 * Import all page components here
 */
import App from './App';
import Login from './components/Login/LoginSecond';
import MainContainer from './components/MainContainer/MainContainer';
import MainContainerAdmin from './components/MainContainer/MainContainerAdmin';
import MainContainerAnnChecker from './components/MainContainer/MainContainerAnnChecker';
import MainContainerReadOnly from "./components/MainContainer/MainContainerReadOnly";


export default (
    <Route path="/" component={App}>
        <Route exact path="/" component={Login}/>
        <Route path="/mainContainer" component={MainContainer} />
        <Route path="/mainContainerAdmin" component={MainContainerAdmin} />
        <Route path="/mainContainerAnnChecker" component={MainContainerAnnChecker} />
        <Route path="/mainContainerReadOnly" component={MainContainerReadOnly} />
    </Route>
);