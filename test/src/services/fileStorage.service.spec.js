const path = require('path');
const fs = require('fs');
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

const mockery = require('mockery');

const supertest = require('supertest');

describe('The fileStorage service module', function () {

    let myApp;
    let superApi;
    let fileStorageService;
    const testFolderPath = path.join(__dirname, '../../resources/');
    const testFilePathToCreate = testFolderPath + 'testCreateFile.txt';
    const testFilePathForSave = testFolderPath + 'testSaveToTheEnd.txt';

    before(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerSubstitute('redis', 'redis-mock');

        myApp = require('../../../app');
        superApi = supertest(myApp);
        fileStorageService = require('../../../src/services/fileStorage.service');
    });

    afterEach(function () {

    });

    after(function () {
        mockery.disable();
        if (fs.existsSync(testFilePathToCreate)) {
            fs.unlinkSync(testFilePathToCreate);
        }
    });


    it('Should create file if not exists', function () {

        fileStorageService.insureTheFileExists(testFilePathToCreate);

        let result = fs.existsSync(testFilePathToCreate);

        expect(result).to.be.true;
    });

    it('Should save to the end of file', function () {

        let addData = '{"Testing": "Testing"}';

        fileStorageService.saveToTheEnd(testFilePathForSave, addData);

        let data = fs.readFileSync(testFilePathForSave, 'utf8');

        expect(data.endsWith(addData)).to.be.true;

    });

});
