const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

const supertest = require('supertest');
const mockery = require('mockery');


describe('The Count service module', function () {

    let myApp;
    let superApi;
    let redisService;
    let countService;

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
        countService = require('../../../src/services/count.service');

        chai.spy.restore(redisService.client, 'get');
    });

    afterEach(function () {
        chai.spy.restore(redisService.client, 'get');
    });

    after(function () {
        mockery.disable();
    });


    it('Should get Value, key exists', function () {

        let dbValue = '66';

        chai.spy.on(redisService.client, 'get', () => dbValue);

        let result = countService.processRequest();
        expect(result).to.be.equal(dbValue);
    });


    it('Should get Value, key not exists', function () {

        chai.spy.on(redisService.client, 'get', () => null);

        let result = countService.processRequest();

        expect(result).to.be.null;
    });

});
