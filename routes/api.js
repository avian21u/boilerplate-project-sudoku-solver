'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
let solver = new SudokuSolver();

  /************************************************************/
  /*
  You can POST to /api/check an object containing puzzle, coordinate, 
  and value where the coordinate is the letter A-I indicating the row, 
  followed by a number 1-9 indicating the column, and value is a number from 1-9.
  */
  
  app.route('/api/check')
    .post((req, res) => {
      // Validate puzzle
      var puzzle = req.body.puzzle;
      if (!solver.validate(puzzle)){
        if (puzzle.length !== 81) {
          res.json({ error: 'Expected puzzle to be 81 characters long' })
        }
        else {
          var regex = /^(\d|[.])*$/;
          if (!regex.test(puzzle)) {
            return res.json({ error: 'Invalid characters in puzzle' })  
          }
          else {
            return res.json({ error: 'Puzzle cannot be solved' })    
          }
        }
      };
    
      var coordinate = req.body.coordinate;
      var value = req.body.value;
      // Validate inputs
      // Fields are empty
      if (!puzzle || !coordinate || !value || puzzle.trim() === "" || coordinate.trim() === "" || value.trim() === "") {
        return res.json({ error: "Required field(s) missing" });
      }
      // Fields are not empty
      // If the value submitted to /api/check is not a number between 1 and 9, the returned values will be { error: 'Invalid value' }
      if (Number.isNaN(parseInt(value)) || value < 1 || value > 9) {
        return res.json({error: 'Invalid value'})
      }
      else if (coordinate.length == 2) {
        var row = coordinate[0];
        var col = Number.parseInt(coordinate[1]); //1-based index
        var rows = "ABCDEFGHI";
        var rowIndex = rows.indexOf(row);
        if (rowIndex !== -1 && col >=1 && col <= 9) {
            // If value submitted to /api/check is already placed in puzzle on that coordinate, the returned value will be an object containing a valid property with true if value is not conflicting.
            var index = (9 * rowIndex) + (col - 1);
            if (puzzle[index] === value) {
              return res.json({valid: true});
            }
            // The return value from the POST to /api/check will be an object containing a valid property, 
            // which is true if the number may be placed at the provided coordinate and false if the number may not. 
            else {
              // If false, the returned object will also contain a conflict property which is an array containing 
              // the strings "row", "column", and/or "region" depending on which makes the placement invalid.
              var output = {};
              var conflict = [];
              
              if (!solver.checkRowPlacement(puzzle, row, col, value)) {
                conflict.push('row')
              };
              if (!solver.checkColPlacement(puzzle, row, col, value)) {
                conflict.push('column')
              };
              if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
                conflict.push('region')
              };
              
              if (conflict.length > 0) {
                output['valid'] = false;
                output['conflict'] = conflict;
              }
              else {
                output['valid'] = true;
              }
              return res.json(output);
            }
        } // If the coordinate submitted to api/check does not point to an existing grid cell, the returned value will be { error: 'Invalid coordinate'}
        else return res.json({error: 'Invalid coordinate'});       
      } else return res.json({error: 'Invalid coordinate'});
    });
  
  
  
  /************************************************************/
  // You can POST /api/solve with form data containing puzzle which will be a string containing a combination of numbers (1-9) and periods . to represent empty spaces. 
  
  app.route('/api/solve')
    .post((req, res) => {
      // Validate puzzle
      var puzzle = req.body.puzzle;
      //2. If the object submitted to /api/solve is missing puzzle, the returned value will be { error: 'Required field missing' } 
      if(!puzzle || puzzle.trim() === "") {
        return res.json({ error: 'Required field missing' }) 
      }
      // 3. If the puzzle submitted to /api/solve contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
      // 4. If the puzzle submitted to /api/solve is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
    //5. If the puzzle submitted to /api/solve is invalid or cannot be solved, the returned value will be { error: 'Puzzle cannot be solved' }
      else if (!solver.validate(puzzle)){
          if (puzzle.length !== 81) {
          res.json({ error: 'Expected puzzle to be 81 characters long' })
        }
        else {
          var regex = /^(\d|[.])*$/;
          if (!regex.test(puzzle)) {
            return res.json({ error: 'Invalid characters in puzzle' })  
          }
          else {
            return res.json({ error: 'Puzzle cannot be solved' })    
          }
        }
      } else {
          var solution = solver.solve(puzzle);
          return res.json({ solution: solution });
      }
    });
};
