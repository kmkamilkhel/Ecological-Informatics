// Define cities as regions of interest
var cities = {
    'Abbottabad': ee.Geometry.Point([73.2475, 34.1697]).buffer(20000),
    'Islamabad': ee.Geometry.Point([73.0479, 33.6844]).buffer(20000),
    'Peshawar': ee.Geometry.Point([71.5249, 34.0151]).buffer(20000),
    'Lahore': ee.Geometry.Point([74.3587, 31.5204]).buffer(20000),
    'Sargodha': ee.Geometry.Point([72.6748, 32.0836]).buffer(20000),
    'Muzaffarabad': ee.Geometry.Point([73.4717, 34.3708]).buffer(20000)
  };
  
  // Define common filters
  var startDate = '2010-01-01';
  var endDate = '2022-12-31';
  var cloudFilter = ee.Filter.lt('CLOUD_COVER', 10);
  
  // Function to download Landsat data for a city
  function downloadLandsatData(cityName, geometry) {
    // Load Landsat 5 and 8 collections
    var landsat5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
      .filterDate(startDate, endDate)
      .filterBounds(geometry)
      .filter(cloudFilter);
  
    var landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate(startDate, endDate)
      .filterBounds(geometry)
      .filter(cloudFilter);
  
    // Combine collections and calculate median
    var combined = landsat5.merge(landsat8)
      .map(function(image) {
        var optical = image.select('SR_B.').multiply(0.0000275).add(-0.2);
        var thermal = image.select('ST_B.*').multiply(0.00341802).add(149.0);
        return image.addBands(optical, null, true).addBands(thermal, null, true);
      });
  
    var medianImage = combined.median().clip(geometry);
  
    // Visualization parameters
    var visParams = {
      bands: ['SR_B4', 'SR_B3', 'SR_B2'],
      min: 0.0,
      max: 0.3
    };
  
    // Add to map
    Map.addLayer(medianImage, visParams, cityName + ' True Color');
  
    // Export the image to Google Drive
    Export.image.toDrive({
      image: medianImage,
      description: 'Landsat_' + cityName,
      region: geometry,
      scale: 30,
      folder: 'Landsat_Data',
      fileFormat: 'GeoTIFF'
    });
  }
  
  // Iterate over cities and download data
  Object.keys(cities).forEach(function(city) {
    downloadLandsatData(city, cities[city]);
  });
  
  // Center map on first city
  Map.centerObject(cities['Abbottabad'], 9);