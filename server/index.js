const express = require('express'); 								// https://www.npmjs.com/package/express
const log4js = require('log4js');                                   // https://www.npmjs.com/package/log4js
const session = require('express-session');							// https://www.npmjs.com/package/express-session
const passport = require('passport');								// https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	// https://www.npmjs.com/package/ibmcloud-appid
const mongoose = require('mongoose');
require('dotenv').config();

const urlRouter = require('./routes/url.routes');

// Get the port from the environment variables
const PORT = process.env.PORT || 8080;

// Get database credentials from environment variables
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

// Define the database URL
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@sandbox.dn8da.mongodb.net/Url?retryWrites=true&w=majority`

// Create the express app
const app = express();

// create logger
const logger = log4js.getLogger("testApp");

app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({
   tenantId: process.env.tenantId,
   clientId: process.env.clientId,
   secret: process.env.secret,
   oauthServerUrl: process.env.oauthServerUrl,
   redirectUri: `http://localhost:${PORT}/appid/callback`
}));
app.use(express.json());
app.use(express.static('client'));
app.use('/url', urlRouter);

// Handle Login
app.get('/appid/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
	successRedirect: '/',
	forceLogin: true
}));

// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Handle logout
app.get('/appid/logout', function(req, res){
	WebAppStrategy.logout(req);
	res.redirect('/');
});

// Make sure only requests from an authenticated browser session can reach /api
app.use('/api', (req, res, next) => {
	if (req.user){
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
});

// The /api/user API used to retrieve name of a currently logged in user
app.get('/api/user', (req, res) => {
	// console.log(req.session[WebAppStrategy.AUTH_CONTEXT]);
	res.json({
		user: {
			name: req.user.name
		}
	});
});

// Connect to the database
const db = mongoose.connect(DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => res)
    .catch(err => console.log(err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});
