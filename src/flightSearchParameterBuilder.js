import moment from 'moment-timezone';

import { FLIGHT_RESULTS_SORT_TYPES, AIRLINES_FILTER_TYPE } from './constants';

/* https://momentjs.com/docs/#/displaying/format/ */

const DATE_FORMAT = 'DD/MM/YYYY';

const flightSortTypeValues = Object.freeze({
  [FLIGHT_RESULTS_SORT_TYPES.DATE]: 'date',
  [FLIGHT_RESULTS_SORT_TYPES.DURATION]: 'duration',
  [FLIGHT_RESULTS_SORT_TYPES.PRICE]: 'price',
  [FLIGHT_RESULTS_SORT_TYPES.QUALITY]: 'quality',
});

const getFormattedDateTimeRange = (range) => {
  const formattedRange = {};

  if (range) {
    if (range.days) {
      if (range.days.start) {
        const startDate = moment(range.days.start, moment.ISO_8601);
        formattedRange.startDate = startDate.format(DATE_FORMAT);
      }

      if (range.days.end) {
        const endDate = moment(range.days.end, moment.ISO_8601);
        formattedRange.endDate = endDate.format(DATE_FORMAT);
      }
    }

    if (range.timeOfDay) {
      if (range.timeOfDay.start) {
        formattedRange.startTimeOfDay = range.timeOfDay.start;
      }

      if (range.timeOfDay.end) {
        formattedRange.endTimeOfDay = range.timeOfDay.end;
      }
    }
  }

  return formattedRange;
};

const buildFlightSearchParameters = ({
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
}) => {
  const parameters = {
    flyFrom: departureIdentifier,
    to: arrivalIdentifier,
    partner,
    locale,
    offset,
    limit,
    sort: flightSortTypeValues[sortType],
  };

  if (departureDateTimeRange) {
    const formattedDepartureDateTimeRange = getFormattedDateTimeRange(departureDateTimeRange);

    parameters.dateFrom = formattedDepartureDateTimeRange.startDate;
    parameters.dateTo = formattedDepartureDateTimeRange.endDate;
    parameters.dtimefrom = formattedDepartureDateTimeRange.startTimeOfDay;
    parameters.dtimeto = formattedDepartureDateTimeRange.endTimeOfDay;
  }

  if (returnDepartureDateTimeRange) {
    const formattedReturnDepartureDateTimeRange = getFormattedDateTimeRange(returnDepartureDateTimeRange); // eslint-disable-line max-len

    parameters.returnFrom = formattedReturnDepartureDateTimeRange.startDate;
    parameters.returnTo = formattedReturnDepartureDateTimeRange.endDate;
    parameters.returndtimefrom = formattedReturnDepartureDateTimeRange.startTimeOfDay;
    parameters.returndtimeto = formattedReturnDepartureDateTimeRange.endTimeOfDay;
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
