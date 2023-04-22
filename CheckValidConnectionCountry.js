//This site or product includes Country Borders data available from https://www.geodatasource.com.

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
  }

  main();
});

/* NAJA alt & irrelevant
getCountryCountryNeighbor().then(function(countryCountryNeighbor) {
  var Neighbors = [];
  getNeighbors("Austria", countryCountryNeighbor, Neighbors);
  console.table(Neighbors);
}).catch(function(error) {
  console.error(error);
});*/

