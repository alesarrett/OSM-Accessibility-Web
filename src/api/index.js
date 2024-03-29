import request from '../utils/request';
import { OSM_NOTE_API } from '../constants';

export class APIError extends Error {
  constructor(payload) {
    super('API error');
    this.payload = payload;
  }
}

export async function fetchLayer(layerName) {
  return request(`/static/data/${layerName}.geojson`);
}

export async function fetchNominatim(query) {
  const url = new URL(`https://nominatim.openstreetmap.org/search/`);
  const params = {
    q: query,
    format: 'geojson',
    addressdetails: 1,
    extratags: 1,
    countrycodes: 'it',
    viewbox: '9.06481,45.382812,9.302908,45.5425',
    bounded: 1
  };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  const response = await fetch(url);
  const body = await response.json();
  console.log(body);
  return body.features;
}

export async function fetchOpenRouteService(directionsState) {
  const { start, end, travelMean } = directionsState;
  const url = new URL(
    `https://api.openrouteservice.org/v2/directions/${travelMean}`
  );
  const params = {
    api_key: '5b3ce3597851110001cf62482fd4e95de6c24215b315c05de4c2bc2e',
    start: `${start[1]},${start[0]}`,
    end: `${end[1]},${end[0]}`
  };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  const response = await fetch(url, {
    headers: {
      Accept: 'application/geo+json'
    }
  });
  const body = await response.json();
  if (response.status >= 400) {
    throw new APIError(body);
  }
  console.log(body);
  return body;
}

export async function saveNote(lat, lon, text) {
  const url = new URL(OSM_NOTE_API);
  const params = {
    lat,
    lon,
    text
  };
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  const response = await fetch(url, { method: 'POST', headers });
  const body = await response.text();
  if (response.status >= 400) {
    throw new APIError(body);
  }
  const xmlResponse = new window.DOMParser().parseFromString(body, 'text/xml');
  console.log(xmlResponse);
  return xmlResponse;
}
