 LST, NDVI, and FVC Calculation Using Landsat Data

This script calculates and visualizes Land Surface Temperature (LST), Normalized Difference Vegetation Index (NDVI), and Fractional Vegetation Cover (FVC) for multiple cities using Landsat 8 data. It also exports the results to Google Drive in GeoTIFF format.

## Features
- **LST Calculation:** Using the `landsat_smw_lst` module to compute LST values in degrees Celsius.
- **NDVI and FVC Calculation:** Median composites of NDVI and FVC derived from the Landsat 8 collection.
- **Visualization:** Layers for LST, NDVI, and FVC are added to the GEE map with color-coded palettes.
- **Export:** Results are exported as GeoTIFF files to a specified Google Drive folder.

## Script Overview
### Input Parameters
- **Cities:** A predefined list of cities with coordinates and buffer areas (20 km radius).
- **Date Range:** The script processes data from `2022-05-01` to `2022-12-31`.
- **Satellite:** Landsat 8 (L8).
- **Cloud Cover Filter:** Only images with less than 10% cloud cover are used.

### Workflow
1. **Data Collection:**
   - Load Landsat 8 collection filtered by date, cloud cover, and region of interest.
   - Apply scaling factors to reflectance and thermal bands.
2. **Composite Creation:**
   - Generate median composites for LST, NDVI, and FVC.
   - Convert LST from Kelvin to Celsius.
3. **Visualization:**
   - Display the layers on the map using appropriate color palettes.
4. **Export:**
   - Save LST, NDVI, and FVC layers as GeoTIFF files to Google Drive.

## Dependencies
- **Google Earth Engine (GEE):** The script is designed to run on the GEE platform.
- **Landsat LST Module:** Imported using:
  ```javascript
  var landsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');
  ```

## How to Use
1. Open the script in the GEE code editor.
2. Modify the `cities` object to include your regions of interest.
3. Run the script.
4. Download the exported GeoTIFF files from your Google Drive.

## Outputs
- **GeoTIFF Files:**
  - `LST_<CityName>.tif`: Land Surface Temperature.
  - `NDVI_<CityName>.tif`: Normalized Difference Vegetation Index.
  - `FVC_<CityName>.tif`: Fractional Vegetation Cover.
- **Visualization:** Color-coded layers displayed on the GEE map.

## Visualization Parameters
- **LST:**
  ```javascript
  { min: 20, max: 48, palette: ['#ffffff', '#ffff99', '#ffcc33', '#ee6600', '#990000'] }
  ```
- **NDVI:**
  ```javascript
  { min: -1, max: 1, palette: ['#640000', '#ff0000', '#006400', '#00c800', '#006400'] }
  ```
- **FVC:**
  ```javascript
  { min: 0, max: 1, palette: ['#640000', '#ff0000', '#006400', '#00c800', '#006400'] }
  ```

## Contact
For questions or feedback, please contact:
- **Author:** Shoaib Ahmad Anees
- **Email:** anees.shoaib@gmail.com
- **Author:** Kaleem Mehmood
- **Email:** kaleemmehmood73@gmail.com