
const expect = require('chai').expect;
const supertest = require('supertest');

const jwt = require('jsonwebtoken');
const config = require('../../../src/config/auth.json');
const mockery = require('mockery');

describe('The User route module', function () {

    let myApp;
    let superApi;

    before(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerSubstitute('redis', 'redis-mock');

        myApp = require('../../../app');
        superApi = supertest(myApp);

    });

    afterEach(function () {

    });

    after(function () {
        mockery.disable();
    });


    it('Should authenticate User', function(done) {

        let user = {
            username: 'testUser', password: 'testPassword'
        };

        superApi.post('/users/authenticate')
            .send(user)
            .expect(200)
            .end(function(err, res) {
                if (err){ return done(err);}
                done();
            });

    });

    it('Should get all Users', function(done) {

        let token = jwt.sign({
            sub: 1,
        }, config.secret, { expiresIn: 60*60 });

        superApi.get('/users/')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
                if (err){ return done(err);}
                expect(res.body).to.be.an.instanceof(Array);
                expect(res.body).to.not.be.empty;
                done();
            });

    });



});



