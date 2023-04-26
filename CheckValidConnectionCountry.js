//This site or product includes Country Borders data available from https://www.geodatasource.com.
//Does someone actually read this?
async function getCsvFile() {

  const data = await $.ajax({
    url: './GEODATASOURCE-COUNTRY-BORDERS.CSV',
    dataType: 'text',
  });
  return data;
}

function getCountryCountryNeighbor() {
  return new Promise(function (resolve, reject) {

    getCsvFile().then(function (data) {
      let csvData = data;
      //Convert to 2d array with only name & border name 
      csvData = data.split('\n');
      let countryCountryNeighbor = [];
      for (let i = 1; i < csvData.length; i++) {
        csvData[i] = csvData[i].replace(/"/g, '');
        let parts = csvData[i].split(',');
        countryCountryNeighbor.push([parts[1], parts[3]]);
      }
      csvData = undefined;
      resolve(countryCountryNeighbor);
    }).catch(function (error) {
      reject(error);
    });
  });
}

function getNeighbors(inputCountry, countryCountryNeighbor, outputCountries) {
  let i = 0;
  try {
    while (countryCountryNeighbor[i][0] != inputCountry) {
      i++;
    }
  } catch (error) {
    return 1;
  }
  while (countryCountryNeighbor[i][0] == inputCountry) {
    outputCountries.push(countryCountryNeighbor[i][1]);
    i++;
  } // Is broken if there is no stop at the end of the csv file or it wont get out of the while loop
  return outputCountries;
}

document.addEventListener("DOMContentLoaded", function () {

  async function main() {
    let countryCountryNeighbor;
    const inputCountry = document.getElementById("inputCountry");
    const submitButton = document.getElementById("submit");
    const outputList = document.getElementById("outputList");
    var outputCountries = [];
    countryCountryNeighbor = await getCountryCountryNeighbor();

    inputCountry.addEventListener("keydown", function (event) {
      if (event.key === 'Enter') {
        outputCountries = [];
        outputCountries = getNeighbors(inputCountry.value, countryCountryNeighbor, outputCountries);
        if (outputCountries != 1) {
          document.getElementById("wrongInput").innerHTML = "";
          while (outputList.firstChild) {
            outputList.removeChild(outputList.firstChild);
          }
          for (let i = 0; i < outputCountries.length; i++) 
          {
            let liElement = document.createElement('li');
            liElement.innerHTML = outputCountries[i];
            outputList.appendChild(liElement);
          }
        } else {
          document.getElementById("wrongInput").innerHTML = "Please Enter a valid Country";
        }
      }
    });


  }
  main();
});

async function solveRoute()
{
  let inputCountries = [];
  let output;
  let countryCountryNeighbor;
  inputCountries[0] = document.getElementById("startCountry").value;
  inputCountries[1] = document.getElementById("stopCountry").value;
  inputCountries.sort();
  countryCountryNeighbor = await getCountryCountryNeighbor();
  output = computeShortestRoute(inputCountries, countryCountryNeighbor);
  console.table(inputCountries);
  console.log(output);
  document.getElementById("solution").innerHTML = output;
}

function computeShortestRoute(inputCountries, countryCountryNeighbor) //I dont think its possible to easily compute all of them, so its just gonna be one shortest round not all possibilities, may suck heavily : )
{
  let maxIterations = 20;
  var solution = [];
  let neighbors = [];
  let currentCountry;
  let treeIndex = 0; // This is total bullshit
  let treeDepth = 0;
  let availableCountries = [];
  let visitedCountries = [];
  while (treeDepth < maxIterations) {
    if (treeDepth == 0) {
      currentCountry = inputCountries[0];
    }
    neighbors = [];
    if (treeDepth == 0) {
      neighbors = getNeighbors(currentCountry, countryCountryNeighbor, neighbors);
      availableCountries[treeDepth] = neighbors;
    } else {
      availableCountries[treeDepth] = [];
      let offsetArray = 0;
      for (let i = 0; i < availableCountries[treeDepth - 1].length; i++) {

        currentCountry = availableCountries[treeDepth - 1][i].split('/');
        if (!(visitedCountries.includes(currentCountry[0]))) {
          visitedCountries.push(currentCountry[0]);
          availableCountries[treeDepth] = getNeighbors(currentCountry[0], countryCountryNeighbor, neighbors);
          // mark the branch in order to trace back the solution
          let initalLength = availableCountries[treeDepth].length - offsetArray;
          for (let x = 0; x < initalLength; x++) {
            availableCountries[treeDepth][x + offsetArray] = availableCountries[treeDepth][x + offsetArray] + "/" + currentCountry;
          }
          offsetArray = offsetArray + initalLength;
        }
      }
    }
    treeIndex = availableCountries[treeDepth].length - 1;
    while (treeIndex) {
      let checkSolution;
      try {
        checkSolution = availableCountries[treeDepth][treeIndex].split('/');
      } catch (error) {
        return "No possible way/Not a valid country";
      }
      checkSolution = checkSolution[0]
      if (checkSolution == inputCountries[1]) {
        solution.push(availableCountries[treeDepth][treeIndex]);
        return solution;
      }
      treeIndex--;
    }
    treeDepth++;
  }
}
