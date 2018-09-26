let chai = require('chai');

let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Api Test', function() {
    describe('POST /object for save data', function() {
        it('responds with status 200', function(done) {
            chai.request(server)
                .post('/object')
                .set('content-type', 'application/json')
                .send({"mocha1Key":"mocha1Value1"})
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.an('Object');
                    expect(res.body).to.have.property('key');
                    let key_id = res.body.key;
                    chai.request(server)
                        .get('/object/'+key_id)
                        .end((err, res) => {
                            console.log('this was run the get key part.');
                            res.should.have.status(200);
                            should.exist(res.body);
                            res.body.should.be.an('object');
                            done();
                        });
                });
        });
    });

    describe('GET /object for empty data', function() {
        it('responds with status 200', function(done) {
            chai.request(server)
                .get('/object/rickytest')
                .set('content-type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.an('Object');
                    done();
                });
        });
    });

    describe('GET /object with timestamp', function() {
        it('responds with status 200', function(done) {
            chai.request(server)
                .get('/object/mykey?timestamp=1537563316')
                .set('content-type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.an('Object');
                    done();
                });
        });
    });

    describe('GET /object with error timestamp', function() {
        it('responds with status 400', function(done) {
            chai.request(server)
                .get('/object/mykey?timestamp=asdfadsfasdf')
                .set('content-type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(400);
                    should.exist(res.body);
                    res.body.should.be.an('Object');
                    done();
                });
        });
    });

    describe('POST /object for error data', function() {
        it('responds with status 400', function(done) {
            chai.request(server)
                .post('/object')
                .set('content-type', 'text/plain')
                .send("mykey=myvalue")
                .end((err, res) => {
                    res.should.have.status(400);
                    should.exist(res.body);
                    res.body.should.be.an('Object');
                    done();
                });
        });
    });
});