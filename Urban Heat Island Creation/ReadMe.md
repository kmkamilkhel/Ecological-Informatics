# Urban Heat Island (UHI) Analysis Using Landsat Data

This script calculates and visualizes Urban Heat Island (UHI) intensity for multiple cities using Landsat 8 Land Surface Temperature (LST) data. The results include UHI intensity maps and summary statistics for urban and rural regions.

## Features
- **LST Calculation:** Uses the `landsat_smw_lst` module to compute LST values in degrees Celsius.
- **Urban vs. Rural Comparison:** Calculates mean LST for urban and rural areas to estimate UHI intensity.
- **Visualization:** Displays UHI maps with a color-coded intensity scale.
- **Export:** Saves UHI maps as GeoTIFF files to Google Drive.

## Script Overview
### Input Parameters
- **Cities:** A list of cities with coordinates and buffer areas to define urban and rural zones.
- **Date Range:** The script processes data from `2022-05-01` to `2022-12-31`.
- **Satellite:** Landsat 8 (L8).
- **Cloud Cover Filter:** Filters images with less than 10% cloud cover.

### Workflow
1. **Load Data:**
   - Use the Landsat LST module to load and process Landsat 8 data for the specified cities.
2. **Define Zones:**
   - Urban zone: Inner buffer (1 km within city boundary).
   - Rural zone: Outer buffer (3 km outside city boundary).
3. **Calculate Mean LST:**
   - Compute mean LST for urban and rural zones.
   - Calculate UHI intensity as the difference between urban and rural mean LST.
4. **Visualize UHI:**
   - Display UHI intensity maps with a gradient color palette.
5. **Export Results:**
   - Save UHI maps as GeoTIFF files to Google Drive.

## Dependencies
- **Google Earth Engine (GEE):** The script is designed for the GEE platform.
- **Landsat LST Module:** Imported using:
  ```javascript
  var landsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');
  ```

## How to Use
### Step 1: Open the Script
- Copy the script into the GEE code editor.

### Step 2: Define Cities
- Modify the `cities` object to include your regions of interest.

### Step 3: Run the Script
- Execute the script in GEE.
- The UHI maps will be displayed on the map.

### Step 4: Download Results
- Access the exported GeoTIFF files from the `UHI_Data` folder in your Google Drive.

## Outputs
- **UHI Intensity Maps:** Visual representations of UHI intensity.
- **GeoTIFF Files:**
  - `UHI_<CityName>.tif`: UHI intensity map for each city.
- **Summary Statistics:**
  - Mean LST for urban and rural zones.
  - UHI intensity values.

## Visualization Parameters
- **UHI Intensity:**
  ```javascript
  { min: -5, max: 5, palette: ['#0000ff', '#ffffff', '#ff0000'] }
  ```

## Example
### Sample Output for Islamabad:
- **Urban Mean LST:** 32.5°C
- **Rural Mean LST:** 30.0°C
- **UHI Intensity:** 2.5°C
- **UHI Map:** Displayed with a gradient from blue (cooler) to red (warmer).

## Contact
For questions or feedback, please contact:
- **Author:** Shoaib Ahmad Anees
- **Email:** anees.shoaib@gmail.com
