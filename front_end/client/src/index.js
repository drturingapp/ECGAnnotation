import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Router} from 'react-router';
//import hashHistory from 'react-router-dom'
//import history from 'react-router-dom'
import routes from './routes';

import { BrowserRouter, Link, Route } from 'react-router-dom';

import Login from './components/Login/LoginSecond';
import MainContainer from './components/MainContainer/MainContainer';
import MainContainerAdmin from './components/MainContainer/MainContainerAdmin';
import MainContainerAnnChecker from './components/MainContainer/MainContainerAnnChecker';
import MainContainerReadOnly from "./components/MainContainer/MainContainerReadOnly";
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import UploadFilePage from './components/uploadFilePage/uploadFilePage';
import VerifyEmail from './components/VerifyEmail/verifyEmail';

ReactDOM.render(

    <BrowserRouter basename={'ECGAnnotation'}>
        <div>
            <Route exact path="/" component={Login}/>
            <Route path="/mainContainer" component={MainContainer} />
            <Route path="/mainContainerAdmin" component={MainContainerAdmin} />
            <Route path="/mainContainerAnnChecker" component={MainContainerAnnChecker} />
            <Route path="/mainContainerReadOnly" component={MainContainerReadOnly} />
            <Route exact path="/register" component={Register}/>
            <Route exact path="/forgot-password" component={ForgotPassword}/>
            <Route exact path="/reset-password" component={ResetPassword}/>
            <Route exact path="/upload" component={UploadFilePage}/>
            <Route exact path="/verify-email" component={VerifyEmail}/>
        </div>
    </BrowserRouter>
    ,
    document.getElementById('root')

);

