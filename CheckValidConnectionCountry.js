//This site or product includes Country Borders data available from https://www.geodatasource.com.

async function getCsvFile() {

  const data = await $.ajax({
    url: './GEODATASOURCE-COUNTRY-BORDERS.CSV',
    dataType: 'text',
  });
  return data;
}

var inputCountries = [["Austria"]["Belgium"]];

getCsvFile().then(function(data){ 
  csvData = data;
  //Convert to 2d array with only name & border name 
  var csvData = data.split('\n');
  var countryCountryNeigbor = [];
  for (var i = 1; i < csvData.length; i++)
  {
    csvData[i] = csvData[i].replace(/"/g, '');
    var parts = csvData[i].split(',');
    countryCountryNeigbor.push([parts[1], parts[3]]);
  }
  console.table(countryCountryNeigbor);
  csvData = undefined;
  inputCountries.sort();
})

function getNeigbors(inputCountry,countryCountryNeigbor)
{
  var i = 0;
  while(countryCountryNeigbor[i][0] != "")
  {

  }
}
