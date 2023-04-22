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
  }
  return outputCountries;
}

document.addEventListener("DOMContentLoaded", function () {

  async function main() {
    let countryCountryNeighbor;
    const inputCountry = document.getElementById("inputCountry");
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
          for (let i = 0; i < outputCountries.length; i++) {
            let liElement = document.createElement('li');
            liElement.innerHTML = outputCountries[i];
            outputList.appendChild(liElement);
          }
        } else {
          document.getElementById("wrongInput").innerHTML = "Please Enter a valid Country";
        }
      }
    });

    computeShortestRoute(["Italy","Poland"], countryCountryNeighbor)
  }

  main();
});


function computeShortestRoute(inputCountries, countryCountryNeighbor) //I dont think its possible to easily compute all of them, so its just gonna be one shortest round not all possibilities, may suck heavily : )
{
  inputCountries.sort();
  let maxIterations = 8;
  var solution = [];
  let neighbors = [];
  let currentCountry;
  let treeIndex = 0; // This is total bullshit
  let treeDepth = 0;
  let availableCountries = [];
  while(treeDepth < maxIterations)
  {
    if(treeDepth == 0)
    {
      currentCountry = inputCountries[0];
    }/*
    neighbors = getNeighbors(currentCountry, countryCountryNeighbor, neighbors);
    
    for(let x = 0; x < neighbors.length; x++)
    {
      if(neighbors[x] == inputCountries[1])
      {
        solution.push(neighbors[x])
        console.table(solution);
        return solution;
      }
    }
    */
    neighbors = [];
    if(treeDepth == 0)
    {
      neighbors = getNeighbors(currentCountry, countryCountryNeighbor, neighbors);
      availableCountries[treeDepth] = neighbors;
    }else{
      availableCountries[treeDepth] = [];
      for(let i = 0; i < availableCountries[treeDepth-1].length; i++)
      {
        currentCountry = availableCountries[treeDepth-1][i];
        availableCountries[treeDepth] = getNeighbors(currentCountry, countryCountryNeighbor, neighbors);
      }
    }
    treeIndex = availableCountries[treeDepth].length -1;
    while(treeIndex)
    {
      if(availableCountries[treeDepth][treeIndex] == inputCountries[1])
      {
        console.log("succes");
        solution.push(availableCountries[treeDepth][treeIndex]);
        console.table(solution);
        return 0;
      }
      treeIndex--;
    }
    treeDepth++;
  }
}




/* NAJA alt & irrelevant
getCountryCountryNeighbor().then(function(countryCountryNeighbor) {
  var Neighbors = [];
  getNeighbors("Austria", countryCountryNeighbor, Neighbors);
  console.table(Neighbors);
}).catch(function(error) {
  console.error(error);
});*/
