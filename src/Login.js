// Login.js
import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { AmplifySignIn } from '@aws-amplify/ui-react';
import App from './App'; // Import the main employee database component

const Login = () => {
  const [user, setUser] = useState(null);

  const handleSignIn = async (username, password) => {
    try {
      const user = await Auth.signIn(username, password);
      setUser(user);
      console.log('Logged in:', user);
      // You can now redirect the user to the main employee database page
    } catch (error) {
      console.log('Error signing in:', error);
    }
  };

  // Check if the user is already authenticated (e.g., after page refresh)
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null));
  }, []);

  // Render the login UI if the user is not logged in
  if (!user) {
    return (
      <div>
        <h1>Login</h1>
        <AmplifySignIn
          headerText="Custom Login Text" // Optional, customize the header text
          slot="sign-in"
          handleSubmit={handleSignIn}
        />
      </div>
    );
  }

  // Render the main employee database component (App.js) if the user is logged in
  return <App />;
};

export default Login;
