/*
assumption:-
1. columns are on the 0th index and rows are on the 1st index
2. I have used a variable called sections that runs from left to right starting with value 1 , it represents the seat sections in plane
3. The output is like "Assigned seat to 1 person is A13 in 1 section" where 1 is the 1st person in the queue
   A13 is the seat number where A is the aisle seat , 13 means 1 row 3rd column , in 1st section.
4. Test cases aren't added as there is only a single function computing everything with multiple for loops , it would be redundant .

* */

//var seats = [ [3,2], [4,3], [2,3], [3,4] ] example input , so we have 4 sections
// test input = [ [3,2], [4,3], [2,3], [3,4] ] , noOfPeople = 30
const readlineAsync = require("readline-sync");
const readline = require("readline")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let seats = []
rl.question('Enter the input as arrays in json format ', (request) => {
    seats = JSON.parse(request)
  let noOfPeople = Number(readlineAsync.question())
  console.log(`Processing seats for ${noOfPeople} people`)
  console.log("************** The output is like \"Person 1 assigned to seat A13 in 1 section\" where 1 is the 1st person in the queue\n" +
    "   A13 is the seat number where A is the aisle seat , 13 means 1 row 3rd column , in 1st section. ***************")
  computeSeatingArrangement(seats, noOfPeople)
})



function computeSeatingArrangement(seats, noOfPeople){
  let onBoardedPeople = []
  let allocatedSeat = new Map()
  let assignedPeople = 1;
  var seatAndType = new Map()


  for(let i =1;i<=noOfPeople;i++){
    onBoardedPeople.push(i)
  }

  var rowSize=Math.max.apply(Math, seats.map(e=>e[1])); // the maximum rows we have in any section , this is used to iterate while moving from left to right for assignment of seats


// this part is about determining the seat type and it's number like W11 1 , means window seat in 1st row 1st column of 1st section of plane
  for(let i=0;i<seats.length;i++) {
    let seatSize = seats[i]
    for (let column = 0; column < seatSize[0]; column++) {
      for (let row = 0; row < seatSize[1]; row++) {
        let seatNumber = []
        seatNumber.push(row+1)
        seatNumber.push(column+1)
        if (i === 0 && column === 0) {
          seatAndType.set(`W${row+1}${column+1} in ${i+1} section`, seatNumber) // pushing window seat
        } else if (i === seats.length - 1 && column === seatSize[0] - 1) {
          seatAndType.set(`W${row+1}${column+1} in ${i+1} section `, seatNumber) // pushing window seat
        } else if (column === 0 || column === seatSize[0] - 1) {
          seatAndType.set(`A${row+1}${column+1} in ${i+1} section `, seatNumber)  // pushing aisle seat
        } else {
          seatAndType.set(`C${row+1}${column+1} in ${i+1} section `, seatNumber)  // pushing aisle seat
        }

      }
    }
  }

// this section is about using the seatType and iterating from left to right for assignment of seats , first Aisle type
// W11 the seat number , the second character is the row number , we fetch all the Aisle type seats in first row using the row number ,
// say A22, A22, A23, A24 and use the section to check which section does this seat belong to
// and the third nested loop is used to look into our seat selection
  for(let parse=1;parse<=rowSize;parse++){
    for(let section=1;section<=seats.length;section++){
      for(let [key, value] of seatAndType){
        let sectionOfSeat = key.toString().substring(6,8)
        if(key.toString().includes('A') && key.toString().charAt(1) == parse && sectionOfSeat==section){
          if(assignedPeople > noOfPeople){
            allocatedSeat.set(`A${value[0]}${value[1]} in section ${section}`, "is an empty seat")
          } else {
            allocatedSeat.set(`Person ${assignedPeople} is assigned to an Aisle seat`, key)
          }
          ++assignedPeople
        }
      }
    }
  }


// then window type
  for(let parse=1;parse<=rowSize;parse++){
    for(let section=1;section<=seats.length;section++){
      for(let [key, value] of seatAndType){
        let sectionOfSeat = key.toString().substring(6,8)
        if(key.toString().includes('W') && key.toString().charAt(1) == parse && sectionOfSeat==section){
          if(assignedPeople > noOfPeople){
            allocatedSeat.set(`W${value[0]}${value[1]} in section ${section}`, "is an empty seat")
          } else {
            allocatedSeat.set(`Person ${assignedPeople} is assigned to a Window seat`, key)
          }
          ++assignedPeople
        }
      }
    }
  }

// then centre type

  for(let parse=1;parse<=rowSize;parse++){
    for(let section=1;section<=seats.length;section++){
      for(let [key, value] of seatAndType){
        let sectionOfSeat = key.toString().substring(6,8)
        if(key.toString().includes('C') && key.toString().charAt(1) == parse && sectionOfSeat==section){
          if(assignedPeople > noOfPeople){
            allocatedSeat.set(`C${value[0]}${value[1]} in section ${section}`, "is an empty seat")
          } else {
            allocatedSeat.set(`Person ${assignedPeople} assigned to a Middle seat`, key)
          }
          ++assignedPeople
        }
      }
    }
  }

  //printing the output
  for(let [key, value] of allocatedSeat){
    console.log(key, value)
  }
}
