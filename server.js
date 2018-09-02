var express = require('express');
var bodyParser = require('body-parser');
var user  = require('./app/models/user');
var app = express();
var jwt = require('jsonwebtoken');
var superSecret = 'thisIsSuperSecret';

var apiRouter = express.Router();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function (req,res) {
	res.send('welcome to the HOME')
});

apiRouter.use(function(req,res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
		jwt.verify(token,superSecret,function(err,decoded){
			if(err){
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate'
				});
			} else {
				req.decoded = decoded ;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

apiRouter.get('/',function(req,res) {
	res.json( { message : 'hooray welcome to api !!! '} ); 
})

apiRouter.route('/users').post(function(req,res){
	user.register(req,res);
});

apiRouter.route('/users').get(function(req,res){
	user.getAllUsers(req,res);
});

apiRouter.route('/users/:user_id').get(function(req,res){
	user.getUser(req,res);
});

apiRouter.route('/users/:user_id').put(function(req,res){
	user.getUser(req,res);
});

apiRouter.post('/authenticate',function(req,res){
	user.authenticate(req,res);
})

app.use('/api',apiRouter)

app.listen(8888,()=> { console.log('port listening at 8888'); });