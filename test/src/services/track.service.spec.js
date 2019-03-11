const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

const supertest = require('supertest');
const mockery = require('mockery');

const config = require('./../../../src/config/config');
const storageItem = require('./../../../src/model/makeStorageItem');

describe('The Track service module', function () {

    let myApp;
    let superApi;
    let redisService;
    let trackService;

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
        trackService = require('../../../src/services/track.service');


    });

    afterEach(function () {
        chai.spy.restore(redisService.client, 'incrby');
    });

    after(function () {
        chai.spy.restore(config, 'getDataStorageLocation');
        mockery.disable();
    });


    it('Should process Request without count', function* () {
        let reqBody = {'myTestparam': 'test'};
        let result = trackService.processRequest(reqBody);
        expect(result).to.be.true;
    });

    it('Should process Request with count', function* () {
        let reqBody = {'myTestparam': 'test'};
        reqBody[config.requestCounterName] = 15;

        chai.spy.on(redisService.client, 'incrby', () => 45);

        let result = trackService.processRequest(reqBody);

        expect(result).to.be.true;
    });


    it('Should increase counter', function* () {
        let dbValue = 75;
        let addValue = 5;

        chai.spy.on(redisService.client, 'incrby', () => dbValue + addValue);

        let result = trackService.increaseCounter(addValue);

        expect(result).to.be.equal(dbValue + addValue);
    });


    it('Should create storage item', function* () {

        let storageContent = {'storageParam': 'testStorageContent'};

        let item = trackService.makeStorageItem(storageContent);

        expect(item.content).to.have.property('timestamp');
        expect(item.content).to.have.property('content', storageContent);

    });


    it('Should save storage item', function* () {

        let storageContent = {'storageParam': 'testStorageContent'};
        let item = storageItem.makeStorageItem(storageContent);

        let isSaved = trackService.saveStorageItem(item);

        expect(isSaved).to.be.true;
    });

});
