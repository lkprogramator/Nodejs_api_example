const chai = require('chai');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

const mockery = require('mockery');
const supertest = require('supertest');

const userService = require('../../../src/services/user.service');

describe('The User service module', function () {

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


    it('Should authenticate User by service', function(done) {

        let user = {
            username: 'testUser', password: 'testPassword'
        };

        userService.authenticate(user)
            .then( (result) => {
                expect(result).to.have.property('id');
                expect(result).to.have.property('username');
                expect(result).to.have.property('firstName');
                expect(result).to.have.property('lastName');
                expect(result).to.have.property('token');
        }).finally(done);

    });

    it('Should get all Users', function(done) {

       userService.getAll()
           .then( (result) => {

           expect(result).to.be.instanceOf(Array);
           expect(result).to.be.not.empty;
        }).finally(done);




    });



});



