import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = Cookies.get('authToken'); // Retrieve the token from the cookie
  console.log('token: ', token);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(false);
    } else {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000); // Show loading indicator for 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : loading ? (
          <div>Loading...</div>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;