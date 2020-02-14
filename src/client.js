import axios from 'axios';
import qs from 'qs';

import buildFlightSearchParameters from './flightSearchParameterBuilder';

import {
  SKYPICKER_BASE_API_URL,
  LOCATION_TYPES,
  LOCATION_RESULTS_SORT_TYPES,
} from './constants';

const locationTypeValues = Object.freeze({
  [LOCATION_TYPES.AIRPORT]: 'airport',
  [LOCATION_TYPES.AUTONOMOUS_TERRITORY]: 'autonomous_territory',
  [LOCATION_TYPES.CITY]: 'city',
  [LOCATION_TYPES.COUNTRY]: 'country',
  [LOCATION_TYPES.SUBDIVISION]: 'subdivision',
});

const locationSortTypeValues = Object.freeze({
  [LOCATION_RESULTS_SORT_TYPES.ASCENDING_NAME]: 'name',
  [LOCATION_RESULTS_SORT_TYPES.DESCENDING_NAME]: '-name',
  [LOCATION_RESULTS_SORT_TYPES.ASCENDING_RANK]: 'rank',
  [LOCATION_RESULTS_SORT_TYPES.DESCENDING_RANK]: '-rank',
});

const paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'repeat' });

/* https://skypickerpublicapi.docs.apiary.io/#reference/locations/locations-collection/search-by-query */

const searchLocationsByTerm = ({
  term,
  locale,
  locationTypes = [],
  limit,
}) => (
  axios.get(`${SKYPICKER_BASE_API_URL}/locations`, {
    params: {
      term,
      locale,
      location_types: locationTypes.map((type) => locationTypeValues[type]),
      limit,
    },
    paramsSerializer,
  }).then((response) => response.data)
);

/* https://skypickerpublicapi.docs.apiary.io/#reference/locations/locations-collection/search-by-radius */

const searchLocationsByRadius = ({
  coordinate,
  radius,
  locale,
  locationTypes = [],
  limit,
  sortTypes = [],
}) => (
  axios.get(`${SKYPICKER_BASE_API_URL}/locations`, {
    params: {
      type: 'radius',
      lat: coordinate.latitude,
      lon: coordinate.longitude,
      radius,
      locale,
      location_types: locationTypes.map((type) => locationTypeValues[type]),
      limit,
      sort: sortTypes.map((type) => locationSortTypeValues[type]),
    },
    paramsSerializer,
  }).then((response) => response.data)
);

/* https://skypickerpublicapi.docs.apiary.io/#reference/locations/locations-collection/search-by-box */

const searchLocationsByBox = ({
  lowCoordinate,
  highCoordinate,
  locale,
  locationTypes = [],
  limit,
  sortTypes = [],
}) => (
  axios.get(`${SKYPICKER_BASE_API_URL}/locations`, {
    params: {
      type: 'box',
      low_lat: lowCoordinate.latitude,
      low_lon: lowCoordinate.longitude,
      high_lat: highCoordinate.latitude,
      high_lon: highCoordinate.longitude,
      locale,
      location_types: locationTypes.map((type) => locationTypeValues[type]),
      limit,
      sort: sortTypes.map((type) => locationSortTypeValues[type]),
    },
    paramsSerializer,
  }).then((response) => response.data)
);

/* https://skypickerpublicapi.docs.apiary.io/#reference/locations/locations-collection/get-by-id */

const getLocationById = ({
  id,
  locale,
}) => (
  axios.get(`${SKYPICKER_BASE_API_URL}/locations`, {
    params: { type: 'id', id, locale },
  }).then((response) => response.data)
);

/* https://skypickerpublicapi.docs.apiary.io/#reference/locations/locations-collection/get-dump */

const getLocationDump = ({
  locale,
  locationTypes = [],
  limit,
  sortTypes = [],
}) => (
  axios.get(`${SKYPICKER_BASE_API_URL}/locations`, {
    params: {
      type: 'dump',
      locale,
      location_types: locationTypes.map((type) => locationTypeValues[type]),
      limit,
      sort: sortTypes.map((type) => locationSortTypeValues[type]),
    },
    paramsSerializer,
  }).then((response) => response.data)
);

/* https://skypickerpublicapi.docs.apiary.io/#reference/airlines/get */

const getAirlines = () => axios.get(`${SKYPICKER_BASE_API_URL}/airlines`).then((response) => response.data);

/* https://skypickerpublicapi.docs.apiary.io/#reference/airline-logos/get */

const getAirlineIcon = (airlineCode) => axios.get(`https://images.kiwi.com/airlines/64/${airlineCode}.png`);

/* https://skypickerpublicapi.docs.apiary.io/#reference/airline-logos/get */

const searchFlights = ({
  departureIdentifier,
  arrivalIdentifier,
  departureDateTimeRange,
  returnDepartureDateTimeRange,
  maximumHoursInFlight,
  passengerCount,
  directFlightsOnly,
  currencyCode,
  priceRange,
  maximumStopOverCount,
  airlinesFilter,
  partner,
  locale,
  offset,
  limit,
  sortType,
}) => (
  axios.get(`${SKYPICKER_BASE_API_URL}/flights`, {
    params: buildFlightSearchParameters({
      departureIdentifier,
      arrivalIdentifier,
      departureDateTimeRange,
      returnDepartureDateTimeRange,
      maximumHoursInFlight,
      passengerCount,
      directFlightsOnly,
      currencyCode,
      priceRange,
      maximumStopOverCount,
      airlinesFilter,
      partner,
      locale,
      offset,
      limit,
      sortType,
    }),
    paramsSerializer,
  }).then((response) => response.data)
);

export {
  searchLocationsByTerm,
  searchLocationsByRadius,
  searchLocationsByBox,
  getLocationById,
  getLocationDump,
  getAirlines,
  getAirlineIcon,
  searchFlights,
};
