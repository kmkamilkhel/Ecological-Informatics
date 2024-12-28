// Define cities as regions of interest
var cities = {
  'Abbottabad': ee.Geometry.Point([73.2475, 34.1697]).buffer(20000),
  'Islamabad': ee.Geometry.Point([73.0479, 33.6844]).buffer(20000),
  'Peshawar': ee.Geometry.Point([71.5249, 34.0151]).buffer(20000),
  'Lahore': ee.Geometry.Point([74.3587, 31.5204]).buffer(20000),
  'Sargodha': ee.Geometry.Point([72.6748, 32.0836]).buffer(20000),
  'Muzaffarabad': ee.Geometry.Point([73.4717, 34.3708]).buffer(20000)
};

// Function to calculate Urban Heat Island (UHI) for a city
function calculateUHI(cityName, geometry) {
  // Load the Landsat LST module
  var landsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');

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

  // Define urban and rural regions
  var urbanMask = ee.Image.constant(1).clip(geometry.buffer(-1000)); // Urban: inner buffer
  var ruralMask = ee.Image.constant(1).clip(geometry.buffer(3000).difference(geometry)); // Rural: outer buffer

  // Calculate mean LST for urban and rural areas
  var urbanLST = landsatComp.updateMask(urbanMask).reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geometry,
    scale: 30,
    maxPixels: 1e9
  });

  var ruralLST = landsatComp.updateMask(ruralMask).reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geometry,
    scale: 30,
    maxPixels: 1e9
  });

  // Calculate UHI intensity
  var urbanMean = ee.Number(urbanLST.get('LST'));
  var ruralMean = ee.Number(ruralLST.get('LST'));
  var uhiIntensity = urbanMean.subtract(ruralMean);

  // Print results
  print(cityName + ' Urban Mean LST:', urbanMean);
  print(cityName + ' Rural Mean LST:', ruralMean);
  print(cityName + ' UHI Intensity:', uhiIntensity);

  // Add UHI layer to map
  var uhiMap = landsatComp.updateMask(urbanMask.subtract(ruralMask)).subtract(ruralMean);
  Map.addLayer(uhiMap, {
    min: -5,
    max: 5,
    palette: ['#0000ff', '#ffffff', '#ff0000']
  }, cityName + ' UHI');

  // Export UHI intensity map
  Export.image.toDrive({
    image: uhiMap,
    description: 'UHI_' + cityName,
    region: geometry,
    scale: 30,
    folder: 'UHI_Data',
    fileFormat: 'GeoTIFF'
  });
}

// Iterate over cities and calculate UHI
Object.keys(cities).forEach(function(city) {
  calculateUHI(city, cities[city]);
});

// Center map on the first city
Map.centerObject(cities['Abbottabad'], 9);
