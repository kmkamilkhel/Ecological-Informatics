# Comprehensive Analysis: LST, UHI, Vegetation Dynamics, and Hotspot Analysis

This repository contains scripts and workflows for analyzing Land Surface Temperature (LST), Urban Heat Island (UHI) intensity, vegetation indices, and thermal hotspot dynamics across multiple cities using Landsat 8 data.

## Repository Structure
```
📁 /LST_Data
├── LST_<CityName>.tif  # GeoTIFF files for LST maps

📁 /NDVI_Data
├── NDVI_<CityName>.tif  # GeoTIFF files for NDVI maps

📁 /FVC_Data
├── FVC_<CityName>.tif  # GeoTIFF files for FVC maps

📁 /UHI_Data
├── UHI_<CityName>.tif  # GeoTIFF files for UHI intensity maps

📁 /Hotspot_Analysis
├── Hotspot_<CityName>.shp  # Shapefiles for thermal hotspot zones
├── Hotspot_<CityName>.tif  # Raster maps of thermal zones

📁 /Scripts
├── landsat_data_download.js  # Script to download Landsat data
├── lst_calculation_code.js   # Script to calculate LST, NDVI, and FVC
├── urban_heat_island_analysis.js  # Script to analyze UHI intensity

📁 /Documentation
├── README_LST.md  # Step-by-step guide for LST calculation
├── README_UHI.md  # Step-by-step guide for UHI analysis
├── README_Hotspot.md  # Guide for hotspot analysis
```

## Features
- **Landsat Data Download:** Script to download Landsat data for predefined cities with cloud cover filtering.
- **LST, NDVI, and FVC Calculation:** Generate median composites for LST (in °C), NDVI, and FVC.
- **Urban Heat Island Analysis:** Compare LST between urban and rural zones to calculate UHI intensity.
- **Thermal Hotspot Analysis:** Identify and classify thermal hotspots and cool spots using the Getis-Ord Gi* statistic.
- **Visualization:** Generate and visualize maps for LST, NDVI, FVC, UHI intensity, and thermal hotspots with color-coded palettes.
- **Export:** Save results as GeoTIFF and Shapefiles for further analysis.

## Dependencies
- **Google Earth Engine (GEE):** All scripts are designed to run on GEE.
- **Landsat LST Module:** Required for accurate LST calculations.
  ```javascript
  var landsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');
  ```
- **ArcGIS Pro:** Used for advanced spatial analyses, including thermal hotspot detection.

## Workflow
### 1. Download Landsat Data
- Use the `landsat_data_download.js` script to fetch Landsat 8 imagery for predefined cities.
- Filter data based on date range and cloud cover.

### 2. Calculate LST, NDVI, and FVC
- Run the `lst_calculation_code.js` script to compute:
  - Land Surface Temperature (LST) in °C.
  - Normalized Difference Vegetation Index (NDVI).
  - Fractional Vegetation Cover (FVC).
- Results are exported to the respective folders (`/LST_Data`, `/NDVI_Data`, `/FVC_Data`).

### 3. Urban Heat Island Analysis
- Use the `urban_heat_island_analysis.js` script to:
  - Define urban and rural zones based on buffer distances.
  - Compute mean LST for urban and rural zones.
  - Calculate UHI intensity as the difference between urban and rural LST.
  - Visualize UHI intensity maps.
  - Export UHI maps to `/UHI_Data`.

### 4. Hotspot Analysis
- Perform hotspot analysis in **ArcGIS Pro**:
  - Use the **Getis-Ord Gi*** statistic to identify clusters of high (hotspots) and low (cool spots) LST values.
  - Classify results into thermal zones based on confidence levels (e.g., Tier-1 to Tier-3).
  - Generate raster and vectorized maps of thermal hotspots and cool spots.
- Export results as raster and shapefiles to the `/Hotspot_Analysis` folder.

## Input Parameters
- **Cities:**
  ```javascript
  var cities = {
    'Abbottabad': ee.Geometry.Point([73.2475, 34.1697]).buffer(20000),
    'Islamabad': ee.Geometry.Point([73.0479, 33.6844]).buffer(20000),
    'Peshawar': ee.Geometry.Point([71.5249, 34.0151]).buffer(20000),
    'Lahore': ee.Geometry.Point([74.3587, 31.5204]).buffer(20000),
    'Sargodha': ee.Geometry.Point([72.6748, 32.0836]).buffer(20000),
    'Muzaffarabad': ee.Geometry.Point([73.4717, 34.3708]).buffer(20000)
  };
  ```
- **Date Range:**
  - `2022-05-01` to `2022-12-31`.
- **Cloud Cover Filter:** Less than 10%.

## Outputs
- **LST Maps:**
  - GeoTIFF files for Land Surface Temperature (°C).
- **Vegetation Maps:**
  - NDVI and FVC composites for each city.
- **UHI Maps:**
  - Intensity maps showing temperature differences between urban and rural zones.
- **Hotspot Maps:**
  - Raster and shapefiles of thermal clusters (hotspots and cool spots).
- **Summary Statistics:**
  - Mean LST values for urban and rural zones.
  - UHI intensity for each city.

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
- **UHI Intensity:**
  ```javascript
  { min: -5, max: 5, palette: ['#0000ff', '#ffffff', '#ff0000'] }
  ```
- **Thermal Hotspots:**
  ```text
  - Superior Cool Zone (Tier-3): Z-score < -2.58, p-value < 0.01
  - Superior Hot Zone (Tier-3): Z-score > 2.58, p-value < 0.01
  ```

## How to Use
1. Clone this repository or copy the scripts into the GEE Code Editor.
2. Modify the `cities` object to include your regions of interest.
3. Run the scripts sequentially:
   - `landsat_data_download.js`
   - `lst_calculation_code.js`
   - `urban_heat_island_analysis.js`
4. Perform hotspot analysis using **ArcGIS Pro**.
5. Access the exported GeoTIFF files and shapefiles in the respective folders in Google Drive.

## Example Results
### Islamabad
- **Urban Mean LST:** 32.5°C
- **Rural Mean LST:** 30.0°C
- **UHI Intensity:** 2.5°C

### Lahore
- **Urban Mean LST:** 35.0°C
- **Rural Mean LST:** 33.0°C
- **UHI Intensity:** 2.0°C

### Hotspot Analysis
- **Hotspots (Tier-3):** Areas with extreme thermal anomalies (e.g., >99% confidence).
- **Cool Spots (Tier-3):** Areas with significant cooling anomalies (e.g., >99% confidence).

## Contact
For questions or feedback, please contact:
- **Author:** Shoaib Ahmad Anees
- **Email:** anees.shoaib@gmail.com
- **Author:** Kaleem Mehmood
- **Email:** kaleemmehmood73@gmail.com
