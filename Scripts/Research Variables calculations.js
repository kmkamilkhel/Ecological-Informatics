// Define cities as regions of interest
var cities = {
  'Abbottabad': ee.Geometry.Point([73.2475, 34.1697]).buffer(20000),
  'Islamabad': ee.Geometry.Point([73.0479, 33.6844]).buffer(20000),
  'Peshawar': ee.Geometry.Point([71.5249, 34.0151]).buffer(20000),
  'Lahore': ee.Geometry.Point([74.3587, 31.5204]).buffer(20000),
  'Sargodha': ee.Geometry.Point([72.6748, 32.0836]).buffer(20000),
  'Muzaffarabad': ee.Geometry.Point([73.4717, 34.3708]).buffer(20000)
};

// Load the Landsat LST module
var landsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');

// Function to calculate LST for a city using the LST module
function calculateLST(cityName, geometry) {
  var satellite = 'L8';
  var dateStart = '2022-05-01';
  var dateEnd = '2022-12-31';
  var useNdvi = true;

  // Get Landsat collection with necessary variables
  var landsatColl = landsatLST.collection(satellite, dateStart, dateEnd, geometry, useNdvi);

  // Generate LST composite
  var landsatComp = landsatColl
    .select('LST')
    .median()
    .clip(geometry)
    .subtract(273.15); // Convert to Celsius

  // Visualization parameters for LST
  var visParamsLST = {
    min: 20,
    max: 48,
    palette: ['#ffffff', '#ffff99', '#ffcc33', '#ee6600', '#990000']
  };

  Map.addLayer(landsatComp, visParamsLST, cityName + ' LST');

  // Export LST
  Export.image.toDrive({
    image: landsatComp,
    description: 'LST_' + cityName,
    region: geometry,
    scale: 30,
    folder: 'LST_Data',
    fileFormat: 'GeoTIFF'
  });

  // Generate NDVI composite
  var landsatCompNDVI = landsatColl
    .select('NDVI')
    .median()
    .clip(geometry);

  // Visualization parameters for NDVI
  var visParamsNDVI = {
    min: -1,
    max: 1,
    palette: ['#640000', '#ff0000', '#006400', '#00c800', '#006400']
  };

  Map.addLayer(landsatCompNDVI, visParamsNDVI, cityName + ' NDVI');

  // Export NDVI
  Export.image.toDrive({
    image: landsatCompNDVI,
    description: 'NDVI_' + cityName,
    region: geometry,
    scale: 30,
    folder: 'NDVI_Data',
    fileFormat: 'GeoTIFF'
  });

  // Generate FVC composite
  var landsatCompFVC = landsatColl
    .select('FVC')
    .median()
    .clip(geometry);

  // Visualization parameters for FVC
  var visParamsFVC = {
    min: 0,
    max: 1,
    palette: ['#640000', '#ff0000', '#006400', '#00c800', '#006400']
  };

  Map.addLayer(landsatCompFVC, visParamsFVC, cityName + ' FVC');

  // Export FVC
  Export.image.toDrive({
    image: landsatCompFVC,
    description: 'FVC_' + cityName,
    region: geometry,
    scale: 30,
    folder: 'FVC_Data',
    fileFormat: 'GeoTIFF'
  });
}

// Iterate over cities and calculate LST, NDVI, and FVC
Object.keys(cities).forEach(function(city) {
  calculateLST(city, cities[city]);
});

// Center map on the first city
Map.centerObject(cities['Abbottabad'], 9);
