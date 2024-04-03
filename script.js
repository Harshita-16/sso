const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Configure Passport with the Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: '453804486903-7s8c1ilns49jbddqgg15d8cmq9vf2n0k.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback' // Update with your callback URL
},
function(accessToken, refreshToken, profile, done) {
  // Handle user authentication and create a session if needed
  // Typically, you'd store user information in your database here
  // You can also perform checks like verifying email domains, etc.
  return done(null, profile);
}
));

// Initialize Passport and set up session management
app.use(passport.initialize());
app.use(passport.session());

// Define your login route
app.get('/login',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Define your callback route for Google OAuth
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to a secure route or do other operations
    res.redirect('/secure');
  }
);

// Secure route example
app.get('/secure', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    res.send('Welcome to the secure area, ' + req.user.displayName + '!');
  } else {
    res.redirect('/login');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
