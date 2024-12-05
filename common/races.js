const partdb = require('../data/partsdb.json')


const dorace = function(speed, acceleration, handling, weight, surface, tires) {
    let sspeed = surface.Speed
    let shandling = surface.Handling
    if(tires && tires !== null && tires !== undefined){
      let tiresindb = partdb.Parts[tires.toLowerCase()]

      if(tiresindb && tiresindb.Name.includes("allsurfacetires") && surface.Name.toLowerCase() !== "asphalt"){
        sspeed += 0.2
        shandling += 0.2
      }
      if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() !== "asphalt"){
        sspeed -= 0.2
        shandling -= 0.2
      }
      if(tiresindb && tiresindb.Name.includes("offroadtires") && surface.Name.toLowerCase() == "dirt" || surface.Name.toLowerCase() == "snow" || surface.Name.toLowerCase() == "ice"){
        sspeed -= 0.2
        shandling -= 0.2
      }
      if(tiresindb && tiresindb.Name.includes("offroadtires") && surface.Name.toLowerCase() !== "dirt" || surface.Name.toLowerCase() !== "snow" || surface.Name.toLowerCase() !== "ice"){
        sspeed += 0.2
        shandling += 0.2
      }
     else {
      sspeed += 0
      shandling += 0
     }
    }

    // Define the importance of each factor
    var speedImportance = 0.30;
    var accelerationImportance = 0.25;
    var handlingImportance = 0.20;
    var weightImportance = 0.25;
    let surfacespeed = sspeed
    let surfacehandling = shandling



    var normalizedSpeed = speed * surfacespeed
    var normalizedAcceleration = acceleration  // Lower acceleration is better
    var normalizedHandling = handling * surfacehandling
    var normalizedWeight = weight / 100  // Lower weight is better

    // Calculate the final score
    var score = (speedImportance * normalizedSpeed +
                 accelerationImportance * normalizedAcceleration +
                 handlingImportance * normalizedHandling -
                 weightImportance - normalizedWeight);

    return score;
}

const dorally = function(speed, acceleration, handling, weight, tires) {
  let tiresindb = partdb.Parts[tires]
  let sspeed = 1
  let shandling = 1
  if(tiresindb !== null && tiresindb !== undefined){
    if(tiresindb && !tiresindb.Name.includes("rallytires")){
      speed -= 0.7
      handling -= 0.7
    }
  }

  // Define the importance of each factor
  var speedImportance = 0.5;
  var accelerationImportance = 0.5;
  var handlingImportance = 0.45;
  var weightImportance = 0.45;
  let surfacespeed = sspeed
  let surfacehandling = shandling
  
  
  
  var normalizedSpeed = speed * surfacespeed
  var normalizedHandling = handling * surfacehandling 
  
  
  
  var normalizedAcceleration = acceleration  // Lower acceleration is better
  
  var normalizedWeight = weight / 100  // Lower weight is better
  
  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
               accelerationImportance * normalizedAcceleration +
               handlingImportance * normalizedHandling +
               weightImportance + normalizedWeight);
  
  console.log(score)
  
  return score;
  }
const dospace = function(speed, acceleration, handling, weight) {

  // Define the importance of each factor
  var speedImportance = 0.30;
  var accelerationImportance = 0.10;
  var handlingImportance = 0.60;
  var weightImportance = 0;



  var normalizedSpeed = speed
  var normalizedHandling = handling 
  var normalizedAcceleration = acceleration  // Lower acceleration is better
  var normalizedWeight = weight / 100  // Lower weight is better

  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
               accelerationImportance * normalizedAcceleration +
               handlingImportance * normalizedHandling -
               weightImportance - normalizedWeight);

  return score;
}

const dotrack = function(speed, acceleration, handling, weight, tires) {

  if(tires.toLowerCase().includes("tracktires")){
   handling += 100
  }


  // Define the importance of each factor
  var speedImportance = 0.10;
  var accelerationImportance = 0.20;
  var handlingImportance = 0.40;
  var weightImportance = 0.30;



  var normalizedSpeed = speed
  var normalizedHandling = handling 
  var normalizedAcceleration = acceleration  // Lower acceleration is better
  var normalizedWeight = weight / 100  // Lower weight is better

  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
               accelerationImportance * normalizedAcceleration +
               handlingImportance * normalizedHandling -
               weightImportance - normalizedWeight);

  return score;
}
const dooffroad = function(speed, acceleration, handling, weight, surface, tires) {
let tiresindb = partdb.Parts[tires]
let sspeed = surface.Speed
let shandling = surface.Handling
if(tires && tires !== null && tires !== undefined){

if(tiresindb && tiresindb.Name.includes("allsurfacetires") && surface.Name.toLowerCase() !== "asphalt"){
  sspeed += 0.25
  shandling += 0.25
}
if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() == "asphalt"){
  sspeed += 0.2
  shandling += 0.2
}
if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() !== "asphalt"){
  sspeed -= 0.2
  shandling -= 0.2
}
if(tiresindb && tiresindb.Name.includes("offroadtires")){
  sspeed += 0.4
  shandling += 0.4
}
else {
sspeed += 0
shandling += 0
}}
// Define the importance of each factor
var speedImportance = 0.10;
var accelerationImportance = 0.10;
var handlingImportance = 0.30;
var weightImportance = 0.50;
let surfacespeed = sspeed
let surfacehandling = shandling



var normalizedSpeed = speed * surfacespeed
var normalizedHandling = handling * surfacehandling 



var normalizedAcceleration = acceleration  // Lower acceleration is better

var normalizedWeight = weight / 100  // Lower weight is better

// Calculate the final score
var score = (speedImportance * normalizedSpeed +
             accelerationImportance * normalizedAcceleration +
             handlingImportance * normalizedHandling +
             weightImportance + normalizedWeight);

console.log(score)

return score;
}
const dodrag = function(speed, acceleration, handling, weight, surface, tires) {
let tiresindb = partdb.Parts[tires]
let sspeed = surface.Speed
let shandling = surface.Handling
if(tires && tires !== null && tires !== undefined){

if(tiresindb && tiresindb.Name.includes("allsurfacetires") && surface.Name.toLowerCase() !== "asphalt"){
  sspeed += 0.1
  shandling += 0.1
}
if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() == "asphalt"){
  sspeed += 0.5
  shandling += 0.5
}
if(tiresindb && tiresindb.Name.includes("slicks") && surface.Name.toLowerCase() !== "asphalt"){
  sspeed += 0.2
  shandling += 0.2
}
if(tiresindb && tiresindb.Name.includes("offroadtires")){
  sspeed -= 0.2
  shandling -= 0.2
}
else {
sspeed += 0
shandling += 0
}
}
var speedImportance = 0.30;
var accelerationImportance = 0.50;
var handlingImportance = 0.05;
var weightImportance = 0.15;
let surfacespeed = sspeed
let surfacehandling = shandling



var normalizedSpeed = speed * surfacespeed
var normalizedHandling = surfacehandling 

var normalizedAcceleration = acceleration  // Lower acceleration is better
var normalizedWeight = weight / 100  // Lower weight is better

// Calculate the final score
var score = (speedImportance * normalizedSpeed +
  accelerationImportance * normalizedAcceleration +
  handlingImportance * normalizedHandling -
  weightImportance * normalizedWeight);

return score;
}

module.exports = {
    dorace,
    dospace,
    dotrack,
    dooffroad,
    dodrag,
    dorally
};
