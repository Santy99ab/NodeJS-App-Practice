var express = require('express'),
router = express.Router();

var expressValidator = require('express-validator');
var passwordHash = require('password-hash');
var util = require('util');

router.use(expressValidator());


mydb = require('../db');

router.post("/", function (request, response) {
  if(!mydb) {
    console.log("No database.");
    response.json({result:"error", msg:"No database."});
  }

	//Validate the info
	request.checkBody('email', 'Invalid email').notEmpty().matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "i");;
	request.checkBody('password', 'Invalid password').notEmpty().matches(/^[0-9a-zA-Z]{8,}$/, "i");
	request.checkBody('birthday', 'Invalid birthday').notEmpty().matches(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/, "i");
	request.checkBody('username', 'Invalid username').notEmpty();

	request.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      response.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
      return;
    }
	});

	//Persistent XSS filter on server side (info not validated by regular expressions)
	request.body.username = antiXSS(request.body.username);
	request.body.biography = antiXSS(request.body.biography);
	request.body.hobbies = antiXSS(request.body.hobbies);

	//Transform birthday and hobbies to json format
	var bday = String(request.body.birthday).split('/');
	request.body.birthday = {'day': bday[0] , 'month': bday[1], 'year': bday[2]};
	request.body.hobbies = String(request.body.hobbies).replace(/ /g, "").split(',');

	//Hash the password after save it on the db
	request.body.password = passwordHash.generate(request.body.password);

	//Search users with the same email
	mydb.find({"selector":{"email":request.body.email}}, function(err, result) {
		if (err) {
			throw err;
		}

		var len = result.docs.length;
		if(len==0){

			//Insert the new User
			mydb.insert(request.body, function(err, body, header) {
		  	if (err) {
		      throw err;
		   	}
				console.log(request.body.email + " added to the database.");
				response.json({result:"ok", msg: request.body.email + " added to the database."});
				return;

		  });
		}
		else{
			console.log("user already exists");
			response.json({result:"error", msg:"User already exists."});
		}
	});
});

router.get('/users', function (request, response){

	mydb.list({include_docs:true}, function (err, result) {
  	response.send(result)
	});
});

module.exports = router;

function antiXSS(str){
  return String(str).replace(/&(?!amp;|lt;|gt;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
