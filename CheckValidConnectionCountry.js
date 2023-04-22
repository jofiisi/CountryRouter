//This site or product includes Country Borders data available from https://www.geodatasource.com.

async function getCsvFile() {

  const data = await $.ajax({
    url: './GEODATASOURCE-COUNTRY-BORDERS.CSV',
    dataType: 'text',
  });
  return data;
}

var inputCountries = [["Austria"]["Belgium"]];

function getCountryCountryNeighbor() {
  return new Promise(function (resolve, reject) {

    getCsvFile().then(function (data) {
      csvData = data;
      //Convert to 2d array with only name & border name 
      var csvData = data.split('\n');
      var countryCountryNeighbor = [];
      for (var i = 1; i < csvData.length; i++) {
        csvData[i] = csvData[i].replace(/"/g, '');
        var parts = csvData[i].split(',');
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
  var i = 0;
  while (countryCountryNeighbor[i][0] != inputCountry) {
    i++;
  }
  while(countryCountryNeighbor[i][0] == inputCountry)
  {
    outputCountries.push(countryCountryNeighbor[i][1]);
    i++;
  } 
}


getCountryCountryNeighbor().then(function(countryCountryNeighbor) {
  var Neighbors = [];
  getNeighbors("Austria", countryCountryNeighbor, Neighbors);
  console.table(Neighbors);
}).catch(function(error) {
  console.error(error);
});

