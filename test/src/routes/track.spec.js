const chai = require('chai');

const spies = require('chai-spies');
chai.use(spies);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;
const supertest = require('supertest');
const mockery = require('mockery');

const jwt = require('jsonwebtoken');
const auth = require('../../../src/config/auth.json');
const config = require('../../../src/config/config');

describe('The Count route module', function () {

    // let config;
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

        chai.spy.on(config, 'getDataStorageLocation', () => 'test/resources/testSaveToTheEnd.txt');

        myApp = require('../../../app');
        superApi = supertest(myApp);
        redisService = require('../../../src/services/redis.service');

        token = jwt.sign({
            sub: 1,
        }, auth.secret, {expiresIn: 60 * 60});


    });

    afterEach(function () {
        chai.spy.restore(redisService.client, 'incrby');
    });

    after(function () {
        chai.spy.restore(config, 'getDataStorageLocation');
        mockery.disable();
    });

    it('Should store to file, with count', function (done) {

        let dbValue = 75;
        let addValue = 5;

        let sendedData = {};
        sendedData['myTestparam'] = 'test';
        sendedData[config.requestCounterName] = addValue;

        chai.spy.on(redisService.client, 'incrby', () => dbValue + addValue);

        superApi.post('/track')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/json')
            .send(sendedData)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                expect(res).to.have.status(200);
                done();
            });

    });


    it('Should store to file, without count', function (done) {

        let sendedData = {};
        sendedData['myTestparam'] = 'test';

        superApi.post('/track')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/json')
            .send(sendedData)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                expect(res).to.have.status(200);
                done();
            });

    });

});
