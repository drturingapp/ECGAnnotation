import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route } from 'react-router-dom';

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
import PrivateRoute from './components/protectedRoutes/loginProtected';

ReactDOM.render(
    <BrowserRouter basename={'/'}>
        <div>
            <Route exact path="/" component={Login}/>
            <PrivateRoute path="/mainContainer" component={MainContainer} />
            <PrivateRoute path="/mainContainerAdmin" component={MainContainerAdmin} />
            <PrivateRoute path="/mainContainerAnnChecker" component={MainContainerAnnChecker} />
            <PrivateRoute path="/mainContainerReadOnly" component={MainContainerReadOnly} />
            <Route exact path="/register" component={Register}/>
            <Route exact path="/forgot-password" component={ForgotPassword}/>
            <Route exact path="/reset-password" component={ResetPassword}/>
            <PrivateRoute exact path="/upload" component={UploadFilePage}/>
            <Route exact path="/verify-email" component={VerifyEmail}/>
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);
