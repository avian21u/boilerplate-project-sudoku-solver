class SudokuSolver {
  
  // The validate function should take a given puzzle string and check it 
  // to see if it has 81 valid characters for the input.
  
  validate(puzzleString) {
    // Length has to be 81
    if (puzzleString.length !== 81) {
      return false;
    }
    // Can only contain numbers (no alphabets, special characters besides .)
    var regex  = /^(\d|[.])*$/;
    if (!regex.test(puzzleString)) {
      return false;
    }
    // Now that we know string only has numbers and ".", make sure there aren't already repetitions
    
    // Check for repeats in a row
    for (var row = 0; row < 9; row++) {
      var current_row = puzzleString.substring(row * 9, (row * 9) + 9);
      if(!this.countRepeats(current_row)) {
        return false;
      }
      // Check for repeats in a column
      var current_col = [];
      for (var cell = row; cell < 81; cell += 9) {
        current_col.push(puzzleString[cell]);
      }
      if(!this.countRepeats(current_col.join(''))) {
        return false;
      }
      
      // Check for repeats in a region
      if (row % 3 === 0) {
        // Check the 3 regions starting from that row
        var start_col = 0;
        while (start_col < 9) {
          var current_region = [];
          for (var x = row; x <= row + 2; x++) {
            for (var y = start_col; y <= start_col + 2; y++) {
              var index = (x * 9) + y;
              current_region.push(puzzleString[index]); 
            }
          }
          if(!this.countRepeats(current_region.join(''))) {
            return false;
          }
          start_col += 3;
        }
      }
    }
    
    // Count the number of times it appears in a region

    return true;
  }

  countRepeats(stringOfNine) {
    // Sample = '..9..5.1.'
    
    // Create a dict to store the # of times each number appears in the area of 9
    var obj = {}; 
    // Initiate values
    for (var n = 1; n <= 9; n++){
      obj[n] = 0;
    }
    // Loop through area of 9 and count # of times it appears
    for (var i = 0; i < 9; i++) {
      for (var num = 1; num <= 9; num++) {
        if (stringOfNine[i] == num) {
          obj[num]++;
          if (obj[num] > 1) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  // The check functions should be validating against the current state of the board.
  checkRowPlacement(puzzleString, row, column, value) {

    // Get the row that the value will be in
    var rows = "ABCDEFGHI"
    var rowIndex = rows.indexOf(row); // Uses 0 based index
    var colIndex = column - 1; // Uses 0 based index

    var target_row = puzzleString.substring(rowIndex * 9, (rowIndex * 9) + 9);
    // Loop through the substring row to check if the same value is already there
    for (var col = 0; col < 9; col++) {
      if (target_row[col] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {

    // Get the row that the value will be in
    var rows = "ABCDEFGHI"
    var rowIndex = rows.indexOf(row); // Uses 0 based index
    var colIndex = column - 1; // Uses 0 based index

    // Get the values in the column
    var target_col = [];
    for (var cellIndex = colIndex; cellIndex < 81; cellIndex+= 9) {
      target_col.push(puzzleString[cellIndex]);
    }

    // Loop through the rows in that column to check if the same value is already there
    for (var row = 0; row < 9; row++) {
      if (target_col[row] == value) {
        return false;
      }
    }
    return true; 
  }

  checkRegionPlacement(puzzleString, row, column, value) {
      
    // Using 0-based index to calculate position   
      // Step 1: Get row and column index on a 0-based index basis
      var rows = "ABCDEFGHI"
      var rowIndex = rows.indexOf(row); // Example - Cell H5, rowIndex = 7
      var colIndex = column - 1; // colIndex = 4

      // Step 2: Identify whether the cell is in a top row, middle row, or bottom row of the region
      var rowPosition = (rowIndex % 3 == 0) ? 'top' : (rowIndex % 3 == 1) ? 'center' : 'bottom'; // 7 % 3 == 1, so center
      var colPosition = (colIndex % 3 == 0) ? 'left' : (colIndex % 3 == 1) ? 'middle' : 'right'; // 4 % 3 == 1, so middle

      // Step 3: Generate a flat array of the 3 x 3 the cell is in to check for repetition
      // A. Find out which index to start at
      var startRowIndex = (rowPosition == 'bottom') ? (rowIndex - 2) : (rowPosition == 'center') ? (rowIndex - 1) : rowIndex; // center, so 7 - 1 = 6
      var startColIndex = (colPosition == 'right') ? (colIndex - 2) : (colPosition == 'middle') ? (colIndex - 1) : colIndex; // middle, so 4- 1 = 3
      var startIndex = 9 * startRowIndex + startColIndex; // 57

      // B. Loop through the 3 x 3 area to generate array
      var region = [];
      var i = startIndex;
      // Note: the bottom right of the 3 x 3 area is always the startIndex + 20
      while (i <= startIndex + 20) {
        for (var x = 0; x <= 2; x++) {
          region.push(puzzleString[i]);
          i++;
        }
        i += 6;
      }
      // C. Loop through the substring row to check if the same value is already there
      for (var cell = 0; cell < 9; cell ++) {
        if (region[cell] == value) {
          return false;
        }
      }
      return true; 

  }
  // The solve function should handle solving any given valid puzzle string, 
  // not just the test inputs and solutions. You are expected to write out the logic to solve this.
  solve(puzzleString) {
    // Make sure it's a valid puzzleString before solving
    if (!this.validate(puzzleString)) {
      return false;
    }
    else {
      var puzzle = puzzleString.split(""); // Change the string into an array to make it mutable
      var emptyCells = {}; // Create a dictionary to store index value of empty cell
      var counter = 0; // Counts the number of empty cells
      
      // Loop through the puzzle to get the indices for the empty cells
      for (var index = 0; index < 81; index++) {
        // If it's a period (cell to fill in), 
        if (puzzle[index] === '.') {
          var rowIndex = Math.floor(index/ 9);
          var rows = "ABCDEFGHI"
          var row = rows[rowIndex]; // Get alphabet of row
          var col = index - (rowIndex * 9); // Zero Based Index
          emptyCells[index] = {
                "row": row,
                "col": col,
                "possibilities": []
          }
          counter++;
          
          // Go through numbers 1 to 9 and note the possibiltiies for all empty cells
          for (var num = 1; num <= 9; num++) {
            if (this.checkRowPlacement(puzzleString, row, col + 1, num) 
                && this.checkColPlacement(puzzleString,row, col + 1, num)
                 && this.checkRegionPlacement(puzzleString,row, col + 1, num)) {
              // Add the number as a possibility of values for that cell
              emptyCells[index]["possibilities"].push(num);
            }
          }
          // If there is only one possibility, update the string now to reflect that
          if (emptyCells[index]["possibilities"].length == 1) {
            // Update the puzzle to reflect accordingly
            puzzle[index] = emptyCells[index]["possibilities"][0];
            puzzleString = puzzle.join('');
            counter--;
            // Remove from the object of empty cells
            delete emptyCells[index];
          }
        } // Skip the boxes that are already filled
      }; // Went through the entire puzzle

      // Now that we have a dictionary of all the empty cells and the possible values
      // While there are still empty cells, repeat the following function
      while (counter > 0) {
        for (var cellIndex in emptyCells) {
          // Loop through array of possibiltiies for each empty cell and remove any number that is no longer valid
          emptyCells[cellIndex]["possibilities"].forEach((num, index) => {
            if (!this.checkRowPlacement(puzzleString, emptyCells[cellIndex]["row"], emptyCells[cellIndex]["col"] + 1, num) 
                || !this.checkColPlacement(puzzleString, emptyCells[cellIndex]["row"], emptyCells[cellIndex]["col"] + 1, num) 
                 || !this.checkRegionPlacement(puzzleString, emptyCells[cellIndex]["row"], emptyCells[cellIndex]["col"] + 1, num) ) {
              // Delete from possibiltiies array
              emptyCells[cellIndex]["possibilities"].splice(index, 1);
            }            
          });
          // If there is only one possibility left, update the string now to reflect that
          if (emptyCells[cellIndex]["possibilities"].length == 1) {
            // Update the puzzle to reflect accordingly
            puzzle[cellIndex] = emptyCells[cellIndex]["possibilities"][0];
            puzzleString = puzzle.join('');
            counter--;
            // Remove from the object of empty cells
            delete emptyCells[cellIndex];
          }
        }
      }
      puzzleString = puzzle.join('');
      return puzzleString;
    } // END OF ELSE
  } // END OF SOLVE
  
}

module.exports = SudokuSolver;

