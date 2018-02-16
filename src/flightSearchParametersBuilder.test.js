import moment from 'moment-timezone';
import buildFlightSearchParameters from './flightSearchParameterBuilder';
import { FLIGHT_RESULTS_SORT_TYPES, AIRLINES_FILTER_TYPE } from './constants';

describe('buildFlightSearchParameters', () => {
  beforeEach(() => moment.tz.setDefault('America/New_York'));
  afterEach(() => moment.tz.setDefault());

  const FEB_1_2018 = 1517445207;
  const FEB_16_2018 = 1518741208;

  const FEB_1_2018_ISO_8601 = moment.unix(FEB_1_2018).toISOString();
  const FEB_16_2018_ISO_8601 = moment.unix(FEB_16_2018).toISOString();

  const departureIdentifier = 'departureIdentifier';
  const arrivalIdentifier = 'arrivalIdentifier';
  const locale = 'locale';
  const offset = 'offset';
  const limit = 'limit';
  const sortType = FLIGHT_RESULTS_SORT_TYPES.PRICE;

  const timeRange = {
    start: FEB_1_2018_ISO_8601,
    end: FEB_16_2018_ISO_8601,
  };
  const departureDateTimeRange = timeRange;
  const returnDepartureTimeRange = timeRange;
  const maximumHoursInFlight = 'maximumHoursInFlight';
  const passengerCount = 'passengerCount';
  const directFlightsOnly = true;
  const currencyCode = 'currencyCode';
  const priceRange = {
    start: 'start',
    end: 'end',
  };
  const maximumStopOverCount = 'maximumStopOverCount';
  const airlinesFilter = {
    airlines: ['bae', 'jadley'],
    type: AIRLINES_FILTER_TYPE.INCLUDE,
  };

  it('should build parameters for minimum query', () => {
    const parameters = buildFlightSearchParameters({
      departureIdentifier,
      departureDateTimeRange,
    });
    const expected = {
      flyFrom: departureIdentifier,
      dateFrom: '31/01/2018',
      dateTo: '15/02/2018',
      dtimefrom: '19:33',
      dtimeto: '19:33',
    };
    expect(parameters).toEqual(expected);
  });

  it('should build parameters for maximum query', () => {
    const parameters = buildFlightSearchParameters({
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
    });
    const expected = {
      flyFrom: departureIdentifier,
      to: arrivalIdentifier,
      dateFrom: '31/01/2018',
      dateTo: '15/02/2018',
      dtimefrom: '19:33',
      dtimeto: '19:33',
      locale,
      offset,
      limit,
      sort: 'price',
      returnFrom: '31/01/2018',
      returndtimefrom: '19:33',
      returnTo: '15/02/2018',
      returndtimeto: '19:33',
      maxFlyDuration: maximumHoursInFlight,
      passengers: passengerCount,
      directFlights: 1,
      curr: currencyCode,
      price_from: priceRange.start,
      price_to: priceRange.end,
      maxstopovers: maximumStopOverCount,
      selectedAirlines: 'bae,jadley',
      selectedAirlinesExclude: false,
    };
    expect(parameters).toEqual(expected);
  });
});
