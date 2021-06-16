const chai = require('chai');
const assert = chai.assert;

const Solutions = require('../controllers/puzzle-strings.js');
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  var valid_input = Solutions.puzzlesAndSolutions[0][0];
  var invalid_input_1 = '1.5..2..4..63.12.!.!..5.....9..1..ab8.2.3674.3.7.2..9.47...8..1..16...!926914.37.';
  var invalid_input_2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914'
  
// Logic handles a valid puzzle string of 81 characters
  test('Logic handles a valid puzzle string of 81 characters', function(done){
    Solutions.puzzlesAndSolutions.forEach((solution) => {
      assert.equal(solver.validate(solution[0]), true, "String can only be 81 characters."); 
    });
    done();
  });
// Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done){
    assert.equal(solver.validate(invalid_input_1), false, "String cannot include alphabets and special characters.");
    done();
  });
// Logic handles a puzzle string that is not 81 characters in length
  test('Logic handles a puzzle string that is not 81 characters in length', function(done){
    assert.equal(solver.validate(invalid_input_2), false, "String can only be 81 characters.");
    done();
  });
  
// Logic handles a valid row placement
  test('Logic handles a valid row placement', function(done){
    assert.equal(solver.checkRowPlacement(valid_input , "B", 2, 4), true, "Logic handles a valid row placement.");
    done();
  });
// Logic handles an invalid row placement
  test('Logic handles an invalid row placement', function(done){
    assert.equal(solver.checkRowPlacement(valid_input, "G", 4, 8), false, "Logic handles an invalid row placement - value already in row.");
    done();
  });
// Logic handles a valid column placement
  test('Logic handles a valid column placement', function(done){
    assert.equal(solver.checkColPlacement(valid_input, "G", 4, 2), true, "Logic handles a valid column placement.");
    done();
  });
// Logic handles an invalid column placement
  test('Logic handles a valid column placement', function(done){
    assert.equal(solver.checkColPlacement(valid_input, "D", 8, 4), false, "Logic handles an invalid column placement - existing value in col.");
    done();
  });
// Logic handles a valid region (3x3 grid) placement
  test('Logic handles a valid region (3x3 grid) placement', function(done){
    assert.equal(solver.checkRegionPlacement(valid_input, "G", 3, 3), true, "Logic handles a valid region (3x3 grid) placement.");
    done();
  });
// Logic handles an invalid region (3x3 grid) placement
  test('Logic handles an invalid region (3x3 grid) placement', function(done){
    assert.equal(solver.checkRegionPlacement(valid_input, "E", 4, 2), false, "Logic handles an invalid region (3x3 grid) placement - existing value in region.");
    done();
  });
// Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', function(done){
    Solutions.puzzlesAndSolutions.forEach((solution) => {
        assert.equal(solver.solve(solution[0]), solution[1], "Valid puzzle strings pass the solver.");  
    });
    done();
  });
// Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fails the solver', function(done){
    assert.equal(solver.solve(invalid_input_1), false, "Invalid puzzle strings with special characters fails the solver.");
    assert.equal(solver.solve(invalid_input_2), false, "Invalid puzzle strings less than 81 chars fails the solver.");
    done();
  });
// Solver returns the the expected solution for an incomplete puzzle
  test('Solver returns the the expected solution for an incomplete puzzle', function(done){
    Solutions.puzzlesAndSolutions.forEach((solution) => {
        assert.equal(solver.solve(solution[0]), solution[1], "Solver returns the the expected solution for an incomplete puzzle");  
    });
    done();
  });
});
