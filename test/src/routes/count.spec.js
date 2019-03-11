const chai = require('chai');

const spies = require('chai-spies');
chai.use(spies);
const expect = require('chai').expect;
const supertest = require('supertest');
const mockery = require('mockery');

const jwt = require('jsonwebtoken');
const auth = require('../../../src/config/auth.json');
const config = require('../../../src/config/config');

describe('The Count route module', function () {

    let myApp;
    let superApi;
    let token;
    let redisService;

    before(function () {

        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerSubstitute('redis', 'redis-mock');

        myApp = require('../../../app');
        superApi = supertest(myApp);
        redisService = require('../../../src/services/redis.service');

        token = jwt.sign({
            sub: 1,
        }, auth.secret, {expiresIn: 60 * 60});

    });

    afterEach(function () {

    });

    after(function () {
        mockery.disable();
    });

    it('Should get counter value', function (done) {

        let dbValue = '66';
        chai.spy.on(redisService.client, 'get', () => dbValue);

        superApi.get('/count')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property(config.requestCounterName);
                expect(res.body).to.have.property(config.requestCounterName, dbValue);
                done();
            });

    });


});



