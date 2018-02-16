import moment from 'moment-timezone';

import { FLIGHT_RESULTS_SORT_TYPES, AIRLINES_FILTER_TYPE } from './constants';

/* https://momentjs.com/docs/#/displaying/format/ */

const DATE_FORMAT = 'DD/MM/YYYY';
const TIME_FORMAT = 'HH:mm';

const flightSortTypeValues = Object.freeze({
  [FLIGHT_RESULTS_SORT_TYPES.DATE]: 'date',
  [FLIGHT_RESULTS_SORT_TYPES.DURATION]: 'duration',
  [FLIGHT_RESULTS_SORT_TYPES.PRICE]: 'price',
  [FLIGHT_RESULTS_SORT_TYPES.QUALITY]: 'quality',
});

const buildFlightSearchParameters = ({
  departureIdentifier,
  arrivalIdentifier,
  departureDateTimeRange,
  returnDepartureTimeRange,
  maximumHoursInFlight,
  passengerCount,
  directFlightsOnly,
  currencyCode,
  priceRange,
  maximumStopOverCount,
  airlinesFilter,
  locale,
  offset,
  limit,
  sortType,
}) => {
  const departureStartDateTime = moment(departureDateTimeRange.start, moment.ISO_8601);
  const departureEndDateTime = moment(departureDateTimeRange.end, moment.ISO_8601);

  const parameters = {
    flyFrom: departureIdentifier,
    to: arrivalIdentifier,
    dateFrom: departureStartDateTime.format(DATE_FORMAT),
    dateTo: departureEndDateTime.format(DATE_FORMAT),
    dtimefrom: departureStartDateTime.format(TIME_FORMAT),
    dtimeto: departureStartDateTime.format(TIME_FORMAT),
    locale,
    offset,
    limit,
    sort: flightSortTypeValues[sortType],
  };

  if (returnDepartureTimeRange) {
    if (returnDepartureTimeRange.start) {
      const returnStartDateTime = moment(returnDepartureTimeRange.start, moment.ISO_8601);

      parameters.returnFrom = returnStartDateTime.format(DATE_FORMAT);
      parameters.returndtimefrom = returnStartDateTime.format(TIME_FORMAT);
    }

    if (returnDepartureTimeRange.end) {
      const returnEndDateTime = moment(returnDepartureTimeRange.end, moment.ISO_8601);

      parameters.returnTo = returnEndDateTime.format(DATE_FORMAT);
      parameters.returndtimeto = returnEndDateTime.format(TIME_FORMAT);
    }
  }

  if (maximumHoursInFlight) {
    parameters.maxFlyDuration = maximumHoursInFlight;
  }

  if (passengerCount) {
    parameters.passengers = passengerCount;
  }

  if (directFlightsOnly) {
    parameters.directFlights = 1;
  }

  if (currencyCode) {
    parameters.curr = currencyCode;
  }

  if (priceRange) {
    if (priceRange.start) {
      parameters.price_from = priceRange.start;
    }

    if (priceRange.end) {
      parameters.price_to = priceRange.end;
    }
  }

  if (maximumStopOverCount) {
    parameters.maxstopovers = maximumStopOverCount;
  }

  if (airlinesFilter) {
    if (airlinesFilter.airlines && airlinesFilter.type) {
      parameters.selectedAirlines = airlinesFilter.airlines.join(',');

      parameters.selectedAirlinesExclude = airlinesFilter.type === AIRLINES_FILTER_TYPE.EXCLUDE;
    }
  }

  return parameters;
};

export default buildFlightSearchParameters;
