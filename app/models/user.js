var connection = require('./../../config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var superSecret = 'thisIsSuperSecret';


const saltRounds = 10; 

module.exports.authenticate = function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    console.log(password)
    connection.query('SELECT * FROM student WHERE s_email = ?',[email], function (error, results, fields) {
        if (error) {
            res.send({
                status:false,
                message:'there are some error with query'+error
            })
        }else{
            console.log('new');
            if(results.length >0){
                console.log(password,results[0].password)
                bcrypt.compare(password, results[0].s_password, function(err, result) {
                    
                    console.log(result);
                    if(!err){
                        
                        var token = jwt.sign({
                                name: results[0].s_name,
                                email: results[0].s_email
                            },superSecret,{
                                expiresIn : 1500 
                        });

                        res.json({
                            status:true,
                            token : token, 
                            message:'successfully authenticated'
                        })

                    }else  {
                        res.send({
                        status:false,
                        message:"Email and password does not match"
                    });    
                    }
                });
            }
            else{
                res.send({
                    status:false,
                    message:"Email does not exits"
                });
            }
        }
    });
}

module.exports.register=function(req,res) {
    //var today = new Date();
  //  var pass = '';
    
    //console.log(req.body);
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        req.body.password = hash ;
    

    var users = {
        "s_name": req.body.name,
        "s_email": req.body.email,
        "s_password": req.body.password,
    };

    //console.log(users.password)

    connection.query('INSERT INTO student SET ?', users, function (error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'+error
            })
        } else {
            res.json({
                status: true,
                data: results,
                message: 'user registered sucessfully'
            })
        }
    })

    });

};


module.exports.getAllUsers = function(req,res){
    connection.query('select * from student ', function (error, results, fields) {
        if(error){
             res.json({
                status: false,
                message: 'there are some error with query'+error
            })
        }else {
            res.json({
                status: true,
                data: results,
                message: 'users retreived'
            })
        }
    });
};

module.exports.getUser = function(req,res){
    var id = req.params.user_id; 
    var user = {} ;
    connection.query('select * from student where s_id = ? ' ,[id] ,function (error, results, fields) {
        if(error){
             res.json({
                status: false,
                message: 'there are some error with query'+error
            })
        }else {
            user = results ;
            res.json({
                status: true,
                data: user,
                message: 'user retreived'
            })
        }
    });
}

module.exports.updataUser = function(req,res){
    var id = req.params.user_id; 
    var user = {} ;
    connection.query('select * from student where s_id = ? ' ,[id] ,function (error, results, fields) {
        if(error){
             res.json({
                status: false,
                message: 'there are some error with query'+error
            })
        }else {

            user = results 

            if(req.body.name)
                user.name = req.body.name;

            if(req.body.email)
                user.email = req.body.email;

            if(req.body.password)
                user.password = req.body.password;  

            user.id = id ;

            connection.query('update student set s_name = ? , s_email = ? , s_password = ? where id = ?' , users ,function (terror, tresults, tfields){
                if(terror){
                    res.json({
                        message: 'error occured'
                    });
                }else
                {
                    res.json({
                        message: 'user updated'
                    });
                }
            });

        }
    });
}

module.exports.verifyToken = function(token,res){

    jwt.verify(token,superSecret,function(err,decoded){
            if(err){
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate'
                });
            } else {
                token.decoded = decoded ;
                next();
            }
        });

}