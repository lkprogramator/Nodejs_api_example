const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

const supertest = require('supertest');
const mockery = require('mockery');

describe('The Redis service module', function () {

    let myApp;
    let superApi;
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
    });

    afterEach(function () {
        chai.spy.restore(redisService.client, 'exists');
        chai.spy.restore(redisService.client, 'get');
        chai.spy.restore(redisService.client, 'set');
        chai.spy.restore(redisService.client, 'incrby');
    });

    after(function () {
        mockery.disable();
    });


    it('Should detect that counter key Exists', function () {

        let dbKey = 'test_key_exist';
        chai.spy.on(redisService.client, 'exists', () => true);

        let result = redisService.keyExists(dbKey);

        expect(result).to.be.true;
    });

    it('Should detect that counter key not Exists', function () {

        let dbKey = 'test_key_not_exist';
        chai.spy.on(redisService.client, 'exists', () => false);

        let result = redisService.keyExists(dbKey);

        expect(result).to.be.false;
    });

    it('Should set Value of counter', function () {

        let dbKey = 'test_key';
        let dbValue = 25;
        chai.spy.on(redisService.client, 'set', () => 'OK');

        let result = redisService.setValue(dbKey, dbValue);

        expect(result).to.be.equal('OK');
    });


    it('Should get Value, key exist', function () {

        let dbKey = 'test_key';
        let dbValue = '66';

        chai.spy.on(redisService.client, 'exists', () => true);
        chai.spy.on(redisService.client, 'get', () => dbValue);

        let result = redisService.getValue(dbKey);

        expect(result).to.be.equal(dbValue);
    });


    it('Should get Value, key not exist', function () {

        let dbKey = 'test_key';

        chai.spy.on(redisService.client, 'get', () => null);

        let result = redisService.getValue(dbKey);

        expect(result).to.be.null;
    });


    it('Should increase Value, key exist', function () {

        let dbKey = 'test_key';
        let dbValue = 10;
        let addedValue = 5;
        let expectedResult = dbValue + addedValue;

        chai.spy.on(redisService.client, 'exists', () => true);
        chai.spy.on(redisService.client, 'incrby', () => expectedResult);

        let result = redisService.increaseValue(dbKey, addedValue);

        expect(result).to.be.equal(expectedResult);
    });


    it('Should increase Value, key not exist', function () {

        let dbKey = 'test_key';
        let addedValue = 5;
        let expectedResult = addedValue;

        chai.spy.on(redisService.client, 'exists', () => false);
        chai.spy.on(redisService.client, 'set', () => 'OK');
        chai.spy.on(redisService.client, 'incrby', () => expectedResult);

        let result = redisService.increaseValue(dbKey, addedValue);

        expect(result).to.be.equal(expectedResult);
    });

});
