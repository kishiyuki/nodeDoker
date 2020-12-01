let createError = require('http-errors');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let session = require('express-session');
let fetch = require('isomorphic-fetch');
let mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
// let db = require('./models/index');
const bcrypt = require('bcrypt');

var user_cache = {};

let indexRouter = require('./routes/index');
let signupRouter = require('./routes/signup');
let signinRouter = require('./routes/signin');
let eventcreateRouter = require('./routes/eventcreate');
// let eventpageRouter = require('./routes/eventpage');
// let eventallRouter = require('./routes/eventall');
// let communitiesRouter = require('./routes/communities');
let myPageRouter = require('./routes/mypage');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session, passport.initialize, passport.session
// must line up in sequence as below
app.use(session({
	secret: 'testing',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(username, done) {
  console.log('serializeUser');
  done(null, username);
});

passport.deserializeUser(function(username, done) {
  console.log('deserializeUser');
  done(null, {email:username});
});

// authentication
// passport.serializeUser(function(email, done) {
// 	console.log('serializeUser');
//   connection.query('select * from users where email = "' + email + '";', function(err, user) {
//     let userId = user[0].id;
//     console.log(user[0].id);
//   	done(null, userId); // to deserializeUser
//   });
// });
//
// passport.deserializeUser(function(userId, done) {
// 	console.log('deserializeUser');
// 	done(null, {
//     userId: userId
//   });
// });

// passport.use(new LocalStrategy(
// 	{
// 		emailField: 'email',
// 		passwordField: 'password'
// 	},
// 	function(email, password, done){
// 		connection.query('select * from users;', function(err, users) {
// 			// usernameもpasswordもユニーク前提
// 			let email2 = "";
// 			let password2 = "";
// 			for (i = 0; i < users.length; i++) {
// 				if(email == users[i].email){
//           email2 = users[i].email;
//           password2 = users[i].password.toString();
//         }
// 				// input(type='password')で渡される値はstringのようなので、
// 				// データベースから取り出した値もstringにしています。
// 			}
//       console.log(email)
// 			console.log(email2);
//       console.log(password.toString());
// 			console.log(password2.toString());
// 			console.log(bcrypt.compareSync(password.toString(), password2.toString()));
// 			if (bcrypt.compareSync(password.toString(), password2.toString())) {
//         return done(null, email2); // to serializeUser
// 			}
// 			return done(null, false, {message: 'invalid'});
// 		});
// 	}
// ));

passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function(username, password, done){
		connection.query('select * from users;', function(err, users) {
			// usernameもpasswordもユニーク前提
			let username2 = "";
			let password2 = "";
			for (i = 0; i < users.length; i++) {
				if(username == users[i].email){
          username2 = username;
          password2 = users[i].password.toString();
        }
				// input(type='password')で渡される値はstringのようなので、
				// データベースから取り出した値もstringにしています。
			}
      console.log(username)
			console.log(username2);
      console.log(password.toString());
			console.log(password2.toString());
			console.log(bcrypt.compareSync(password.toString(), password2.toString()));
			if (bcrypt.compareSync(password.toString(), password2.toString())) {
        return done(null, username); // to serializeUser
			}
			return done(null, false, {message: 'invalid'});
		});
	}
));

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/eventcreate', eventcreateRouter);
// app.use('/eventall', eventallRouter);
// app.use('/eventpage', eventpageRouter);
// app.use('/communities', communitiesRouter);
app.use('/mypage', myPageRouter);

// signup時にsigninを実行したい
// 現状はsignupした後、signinページから入らないといけない
app.post('/signup', [body("user_name").not().isEmpty().withMessage("名前を入力してください。"),
                     body("email").isEmail().withMessage("メールアドレスを入力してください。"),
                     body("password").isAlphanumeric().withMessage("パスワードを入力してください。"),
                     body("profession").not().isEmpty().withMessage("職業を入力してください。")
                   ], (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.redirect('/signup');
    }else {
      connection.query('select * from users;', function(err, users){
        connection.query('insert into users set ? ;', {
          user_name: req.body.user_name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          profession: req.body.profession,
          created_at: new Date(),
          updated_at: new Date()
        },
        function(err, success){
          if (err == null) {
            res.redirect('/signin');
          } else {
            res.redirect('/signup');
            console.log(err);
          }
        }
        );
      });
    }
});

app.post('/signin',
	passport.authenticate('local',
		{
			failureRedirect: '/signin'
		}
	),
	function(req, res, next){
		fetch('http://localhost:3000/signin',
			{
				credentials: 'include'
			}
		).then(function(){
			res.redirect('/');
		}).catch(function(e){
			console.log(e);
		});
	}
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
