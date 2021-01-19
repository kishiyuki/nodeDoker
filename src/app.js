let createError = require('http-errors');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let session = require('express-session');
let mysql = require('mysql2');
const util = require('util');
const { body, validationResult } = require('express-validator');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
// let db = require('./models/index');
const bcrypt = require('bcrypt');
const query = util.promisify(connection.query).bind(connection);
setInterval(function () {
  connection.query('SELECT 1');
}, 5000);

process.env.contractid = 'Contract4DQBK7f8szx8pUbFu4h1eyodKSRr9hvcaJVv33uXMd56';

let indexRouter = require('./routes/index');
let signupRouter = require('./routes/signup');
let signinRouter = require('./routes/signin');
let eventcreateRouter = require('./routes/eventcreate');
let evaluateRouter = require('./routes/evaluate');
let participatesRouter = require('./routes/participates');
let eventpageRouter = require('./routes/eventpage');
let eventallRouter = require('./routes/eventall');
let myPageRouter = require('./routes/mypage');
let eConfirmationRouter = require('./routes/eConfirmation');
let saiyoumyPageRouter = require('./routes/saiyoumypage');
let saiyoueConfirmationRouter = require('./routes/saiyoueConfirmation');

let app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

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
app.use('/evaluate', evaluateRouter);
app.use('/participates', participatesRouter);
app.use('/eventall', eventallRouter);
app.use('/eventpage', eventpageRouter);
app.use('/mypage', myPageRouter);
app.use('/eConfirmation', eConfirmationRouter);
app.use('/saiyoumypage', saiyoumyPageRouter);
app.use('/saiyoueConfirmation', saiyoueConfirmationRouter);

// signup時にsigninを実行したい
// 現状はsignupした後、signinページから入らないといけない
app.post('/signup', [body("user_name").not().isEmpty().withMessage("名前を入力してください。"),
                     body("email").isEmail().withMessage("メールアドレスを入力してください。"),
                     body("password").isAlphanumeric().withMessage("パスワードを入力してください。"),
                     body("profession").not().isEmpty().withMessage("職業を入力してください。")
                   ], (req, res, next) =>{
    const errors = validationResult(req);
    let obj = {};
    async function total(){
      const users = await query('select * from users where email = "' + req.body.emaill + '";');
      if(users.length == 0){
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
            obj = {
              status:200
            };
            res.json(obj);
          } else {
            obj = {
              status:500
            };
            res.json(obj);
            console.log(err);
          }
        }
        );
      } else {
        obj = {
          status:401
        };
      }
    }
    if (!errors.isEmpty()) {
      console.log(errors);
      obj = {
        status:400
      };
      res.json(obj);
    }else {
      total();
    }
});

app.post('/signin',
passport.authenticate('local', 
{session: true}),
function(req, res){
  obj = {
    status:200
  };
  res.json(obj);
});


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
