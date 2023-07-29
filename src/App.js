import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Database from './Database';

Amplify.configure(awsmobile);

function App() {
  // Your app content goes here
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Database />} />
        {/* Add more routes for other pages if you have them */}
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
