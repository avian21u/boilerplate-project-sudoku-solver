const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const Solutions = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('POST /api/solve', function() {
    // Solve a puzzle with valid puzzle string: POST request to /api/solve
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle: Solutions.puzzlesAndSolutions[4][0]
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, "Status should be 200");
        assert.equal(res.body.solution, Solutions.puzzlesAndSolutions[4][1], "The return value for puzzle " + Solutions.puzzlesAndSolutions[4][0] + "should be " + Solutions.puzzlesAndSolutions[4][1]);
        done();
      })
    });
    
    // Solve a puzzle with missing puzzle string: POST request to /api/solve
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({})
      .end(function(err, res) {
        assert.equal(res.body.error, 'Required field missing', "The return error should be 'Required field missing'");
        done();
      })
    });
    
    // Solve a puzzle with invalid characters: POST request to /api/solve
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle:'1.5..2..4..63.12.!.!..5.....9..1..ab8.2.3674.3.7.2..9.47...8..1..16...!926914.37.'
      })
      .end(function(err, res) {
        assert.equal(res.body.error, 'Invalid characters in puzzle', "The return error should be 'Invalid characters in puzzle'");
        done();
      })
    });
    
    // Solve a puzzle with incorrect length: POST request to /api/solve
    test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914'
      })
      .end(function(err, res) {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', "The return error should be 'Expected puzzle to be 81 characters long'");
        done();
      })
    });
        
    // Solve a puzzle that cannot be solved: POST request to /api/solve
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle:'9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
      })
      .end(function(err, res) {
        assert.equal(res.body.error, 'Puzzle cannot be solved', "The return error should be 'Puzzle cannot be solved'");
        done();
      })
    });
  });


  suite('POST /api/check', function() {
    
    // Check a puzzle placement with all fields: POST request to /api/check
    test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: Solutions.puzzlesAndSolutions[0][0],
        coordinate: 'G4',
        value: '2' 
      })
      .end(function(err, res) {
        assert.equal(res.body.valid, true, "The return value should be {valid: true}.");
        done();
      })
    });

    // Check a puzzle placement with single placement conflict: POST request to /api/check
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: Solutions.puzzlesAndSolutions[0][0],
        coordinate: 'G4',
        value: '7' 
      })
      .end(function(err, res) {
        assert.equal(res.body.valid, false, 'Response object should identify valid as false.');
        assert.property(res.body, "conflict", 'Response object should contain a conflict field.');
        assert.equal(res.body.conflict.length, 1, 'Response object should identify one single conflict.');
        done();
      })
    });

    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    test('Check a puzzle placement with multiple placement conflict: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: Solutions.puzzlesAndSolutions[0][0],
        coordinate: 'A4',
        value: '5' 
      })
      .end(function(err, res) {
        assert.equal(res.body.valid, false, 'Response object should identify valid as false.');
        assert.property(res.body, "conflict", 'Response object should contain a conflict field.');
        assert.equal(res.body.conflict.length, 2, 'Response object should identify two conflicts.');
        done();
      })
    });

    // Check a puzzle placement with all placement conflicts: POST request to /api/check
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: Solutions.puzzlesAndSolutions[0][0],
        coordinate: 'A4',
        value: '1' 
      })
      .end(function(err, res) {
        assert.equal(res.body.valid, false, 'Response object should identify valid as false.');
        assert.property(res.body, "conflict", 'Response object should contain a conflict field.');
        assert.equal(res.body.conflict.length, 3, 'Response object should identify three conflicts.');
        done();
      })
    });

    // Check a puzzle placement with missing required fields: POST request to /api/check
    test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: Solutions.puzzlesAndSolutions[0][0],
          value: '2' 
        })
        .end(function(err, res) {
          assert.equal(res.body.error, 'Required field(s) missing', "The return error should be 'Required field(s) missing'");
          done();
        })
      });
    
    //  Check a puzzle placement with invalid characters: POST request to /api/check
    test('Check a puzzle placement with invalid characters', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle:'1.5..2..4..63.12.!.!..5.....9..1..ab8.2.3674.3.7.2..9.47...8..1..16...!926914.37.',
        coordinate: 'G4',
        value: '2' 
      })
      .end(function(err, res) {
        assert.equal(res.body.error, 'Invalid characters in puzzle', "The return error should be 'Invalid characters in puzzle'");
        done();
      })
      });


    // Check a puzzle placement with incorrect length: POST request to /api/check
    test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914',
        coordinate: 'G4',
        value: '2' 
      })
      .end(function(err, res) {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', "The return error should be 'Expected puzzle to be 81 characters long'");
        done();
      })
    });

    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
          puzzle: Solutions.puzzlesAndSolutions[0][0],
          coordinate: 'K0',
          value: '2' 
      })
      .end(function(err, res) {
        assert.equal(res.body.error, 'Invalid coordinate', "The return error should be 'Invalid coordinate'");
        done();
      })
    });

    // Check a puzzle placement with invalid placement value: POST request to /api/check
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({
          puzzle: Solutions.puzzlesAndSolutions[0][0],
          coordinate: 'G4',
          value: '24' 
      })
      .end(function(err, res) {
        assert.equal(res.body.error, 'Invalid value', "The return error should be 'Invalid value'");
        done();
      })
    });
    
  });
}); // End of Functional Tests

