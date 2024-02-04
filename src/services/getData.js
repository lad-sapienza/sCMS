import csv from "csvtojson";

const json2GeoJson = (json, geoDataField) => {

  return {
    type: "FeatureCollection",
    features: json.map(item => ({
      type: "Feature",
      properties: item,
      geometry: {
        type: "Point",
        coordinates: [
          item[geoDataField].coordinates[0], // longitude
          item[geoDataField].coordinates[1], // latitude
        ],
      },
    })),
  }
};

/**
 * 
 * @param {String} source required. Data source: can be a Directus endpont (complete with protocol, full path and table name), a path to a local file or a path to e remotelo accessible file
 * @param {Sting} token optional. Authentication token for services supporting Authetnication bearaer token
 * @param {String} transType Data transformation type. At present the following are supported: json, geojson, csv2json
 * @returns 
 */
const getData = async (source, token, transType) => {

  let output;
  let options = {};

  if (token){
    options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  try {
    const response = await fetch(source, options);


    switch (transType) {
      case 'json':
        output = await response.json();
        break;

      case 'geojson':
        const respgeoJson = await response.json();
        output = json2GeoJson(respgeoJson.data, 'coordinates');
        break;
      
      case 'csv2json':
        const csvText = await response.text();
        output = await csv().fromString(csvText);
        break;
    
      default:
        output = await response.text();
        break;
    }

    return output;
    
  } catch (error) {
    throw Error(`Cannot get data from ${source}`)
  }
}

export default getData;