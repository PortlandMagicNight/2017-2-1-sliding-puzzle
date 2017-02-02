var puzzleSize, puzzle;

// Open command line user interface

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What size puzzle board should I create? ', (answer) => {
  puzzleSize = parseInt(answer);
  puzzle = generateBoard(puzzleSize);
  console.log('Puzzle starting arrangement:');
  render();
  prompt();
});

// User input loop

function prompt() {
  rl.question('What piece do you want to move next? ', (answer) => {
    move(parseInt(answer));
    render();
    if (!completed()) {
      prompt();
    } else {
      rl.close();
      console.log('DONE!');
    }
  });
}

// Look through puzzle for location of user choice

function find(choice) {
  console.log('Finding ' + choice);
  for (var row = 0; row < puzzle.length; row++) {
    for (var col = 0; col < puzzle[row].length; col++) {
      if (puzzle[row][col] == choice) {
        return {row:row,col:col};
      }
    }
  }
}

// Move selected piece if possible

function move(choice) {
  var location = find(choice);
  //check right
  if (location.col + 1 < puzzleSize && puzzle[location.row][location.col + 1] == 0) {
    puzzle[location.row][location.col + 1] = choice;
    puzzle[location.row][location.col] = 0;
    return;
  }
  //check left
  if (location.col - 1 >= 0 && puzzle[location.row][location.col - 1] == 0) {
    puzzle[location.row][location.col - 1] = choice;
    puzzle[location.row][location.col] = 0;
    return;
  }
  //check below
  if (location.row + 1 < puzzleSize && puzzle[location.row + 1][location.col] == 0) {
    puzzle[location.row + 1][location.col] = choice;
    puzzle[location.row][location.col] = 0;
    return;
  }
  //check above
  if (location.row - 1 >= 0 && puzzle[location.row - 1][location.col] == 0) {
    puzzle[location.row - 1][location.col] = choice;
    puzzle[location.row][location.col] = 0;
    return;
  }
}

// Check for puzzle completion

function completed() {
  var counter = 1;
  for(var row = 0; row < puzzle.length; row++) {
    for(var col = 0; col < puzzle[row].length; col++) {
      if(puzzle[row][col] == counter) counter++;
      else if (puzzle[row][col] == 0 && row == puzzleSize - 1 && col == puzzleSize - 1) return true;
      else return false;
    }
  }
  return false;
}

// Rendering the puzzle to output

function render() {
  for(var i = 0; i < puzzleSize; i++) {
    console.log(puzzle[i]);
  }
}

// var Test ={
//   SOLVABLE:[13,10,11,6,5,7,4,8,1,12,14,9,3,15,0,2],
//   NONSOLVABLE:[13,10,11,6,5,7,4,8,1,12,14,9,3,15,2,0],
//   SOLVED:[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]]
// };

function makeMultiArray(src){
  var i,j;
  var arr = src.slice();
  var tmp = [];
  var n = Math.sqrt(src.length);

  for(i=0;i<n;i++){
    var row =[];
    for(j=0;j<n;j++){
      row.push(arr.shift());
    }
    tmp.push(row);
  }
  return tmp;
}

function generateBoard(n){
  n = n || 4;
  var i,arr;
  var tmp = [];
  for(i=0;i<n*n;i++){
    tmp[i]=i;
  }

  do {
    arr = shuffle(tmp);
  } while(!isSolvable(arr));

  return makeMultiArray(arr);
}

function shuffle(srcArry){
  var arr = srcArry.slice();

  var i = arr.length;

  var p, tmp;

  while(i !== 0){
    p = Math.floor(Math.random() * i);
    i -= 1;

    tmp = arr[i];
    arr[i] = arr[p];
    arr[p] = tmp;
  }

  return arr;
}

function isSolvable(arr){

  // based on the parity proof explained at http://mathworld.wolfram.com/15Puzzle.html

  var i,j,val;
  var parity = 0;

  var len = arr.length;
  var n = Math.sqrt(len);

  for(i=0;i<len;i++){

    val = arr[i];

    if(val === 0 ){
      if(n%2===0){
        // on a board with even width sliding empty square up/down a row flips the parity
        // doesn't do this on an odd width
        parity += n-1 - (i/n | 0);
      }
      continue;
    }

    for(j=i+1;j<len;j++){
      // count how many square after this one are less

      if(arr[j]<val && arr[j] !== 0){
        parity +=1;
      }
    }
  }

  return parity%2 === 0;

}