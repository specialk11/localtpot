var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHttp);


describe('Server', function() {
	it('ANDROID : should login in and authenticate a user and return their userId /auth POST', function(done) {
	chai.request(server)
		.post('/auth')
	    .send({
		    'idToken' : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0YzNlNjY2YjQwY2RlODMwYzViYWE3MGVjNWE4MjRkZjFiZmQ0NDkifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDgxMDc5MzU1LCJleHAiOjE0ODEwODI5NTUsImF0X2hhc2giOiJQcm5ZR1ZvU0VfbV9yaUk2TzY1a21nIiwiYXVkIjoiMjY0MDA3MjM5NjE2LWd2MWliMTRkOXFkanU4NjRnYnA1MjkyNDltbTYydWNxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5MjI0NjUwNzk4NjA2MTU4MzQxIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjI2NDAwNzIzOTYxNi1ndjFpYjE0ZDlxZGp1ODY0Z2JwNTI5MjQ5bW02MnVjcS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImVtYWlsIjoidHBvdC51c2VyQGdtYWlsLmNvbSJ9.GHSDLJP7eS3hBwVq0Qk6ffypn6h-ubXXqSMu-aE9t1Oz3XZML4iPdA-vpQQ9VDw_mJc2CLBFgugwDZNVXcynSPCQK2S7z8fH6kfYPKqcjunA0rwpXP3T7TCwF-mm1Gz5lZzlx9jGqfgIEN3Sb_M_6x_BDV7Pglv4hxarBSaRCc3NxJELiYlOi1Mh5wbrYKqtd0CRAjfvHCEIO2z_a1wgVIH2H1-ABmd2MbGGKVvvux3AR9E89PPjLWN_rftLwEEGa0WJ3yPmF5kTdDntof_DL0njVWxhLMYjjqSRSt_t9jbskA8JkSOYfglbPyTvnDp2FG7s6vrdJ2TZk9xl5D32Cw" 	// The token id used for logging in
		    'aud' : "109224650798606158341" 			// Users unique userId
		    'authCode' : authCode	// The authentication code which the user has generated
		    })
	    .end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('Object');
			res.body.should.have.property('userId');
			done();
	    });
	});

	it('should return all tasks for today on /tasks/day/:userId/:date GET)', function(done) {
	chai.request(server)
		.get('/tasks/day/109224650798606158341/20161224')
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('Object');
			res.body.should.have.property('eventData');
			done();
		});
	});

	it('should add task for day on /tasks/test POST)', function(done) {
	chai.request(server)
		.post('/tasks/insert')
	    .send(			
	    {
			'userId' : "109224650798606158341"				
			'calendarId' : 'primary'		
			'summary' : 'TEST SUMMARY'				
			'location' : 'TEST LOCATION'			
			'description' : 'TEST DESCRIPTION'		
			'timeMin' : "2016-12-24T00:00:00Z"				
			'timeMax' : "2016-12-24T23:59:59Z"				
		})
	    .end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('String');
			done();
	    });
	});

	it('should remove a task for a certain day on /tasks/delete POST)', function(done) {
	chai.request(server)
		.post('/tasks/delete')
	    .send(			
	    {
			'userId' : "109224650798606158341"				
			'calendarId' : 'primary'	
			'eventId' : ???????????								
		})
	    .end(function(err, res){
			res.should.have.status(200);
			done();
	    });
	});


	it('WEBAPP : should login in and authenticate a user and return their userId /auth POST', function(done) {
	chai.request(server)
		.post('/auth')
	    .send({
		    'idToken' : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0YzNlNjY2YjQwY2RlODMwYzViYWE3MGVjNWE4MjRkZjFiZmQ0NDkifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDgxMDc5MzU1LCJleHAiOjE0ODEwODI5NTUsImF0X2hhc2giOiJQcm5ZR1ZvU0VfbV9yaUk2TzY1a21nIiwiYXVkIjoiMjY0MDA3MjM5NjE2LWd2MWliMTRkOXFkanU4NjRnYnA1MjkyNDltbTYydWNxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5MjI0NjUwNzk4NjA2MTU4MzQxIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjI2NDAwNzIzOTYxNi1ndjFpYjE0ZDlxZGp1ODY0Z2JwNTI5MjQ5bW02MnVjcS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImVtYWlsIjoidHBvdC51c2VyQGdtYWlsLmNvbSJ9.GHSDLJP7eS3hBwVq0Qk6ffypn6h-ubXXqSMu-aE9t1Oz3XZML4iPdA-vpQQ9VDw_mJc2CLBFgugwDZNVXcynSPCQK2S7z8fH6kfYPKqcjunA0rwpXP3T7TCwF-mm1Gz5lZzlx9jGqfgIEN3Sb_M_6x_BDV7Pglv4hxarBSaRCc3NxJELiYlOi1Mh5wbrYKqtd0CRAjfvHCEIO2z_a1wgVIH2H1-ABmd2MbGGKVvvux3AR9E89PPjLWN_rftLwEEGa0WJ3yPmF5kTdDntof_DL0njVWxhLMYjjqSRSt_t9jbskA8JkSOYfglbPyTvnDp2FG7s6vrdJ2TZk9xl5D32Cw" 	// The token id used for logging in
		    'aud' : "109224650798606158341" 			// Users unique userId
		    'authCode' : ???????	// The authentication code which the user has generated
		    'platform' : 'webapp'	// Specific platform being used (i.e 'android', 'webapp')
		    })
	    .end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('Object');
			res.body.should.have.property('userId');
			done();
	    });
	});

	it('WEBAPP : should login in and authenticate a user and return their userId /auth POST', function(done) {
	chai.request(server)
		.post('/tasks/patch')
	    .send({
		    'userId' : "109224650798606158341",
		    'gEventId' : ???????
		    'gCalendarId' : 'primary'
		    'timeMin' : '2017-12-12T00:00:00Z'
		    'timeMax' : '2017-12-12T23:59:59Z'
		    })
	    .end(function(err, res){
			res.should.have.status(204);
			done();
	    });
	});

});
