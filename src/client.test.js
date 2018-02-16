import moment from 'moment-timezone';
import {
  searchLocationsByTerm,
  searchLocationsByRadius,
  getLocationById,
  getAirlines,
  searchFlights,
} from './client';
import {
  LOCATION_TYPES,
  LOCATION_RESULTS_SORT_TYPES,
  AIRLINES_FILTER_TYPE,
  FLIGHT_RESULTS_SORT_TYPES,
} from './constants';

/* Increase timeout from 5s to 10s */
jest.setTimeout(10000);

describe('Client', () => {
  beforeEach(() => moment.tz.setDefault('America/New_York'));
  afterEach(() => moment.tz.setDefault());

  describe('Integration tests', () => {
    describe('searchLocationsByTerm', () => {
      it('should fetch locations for Boston', async () => {
        const data = await searchLocationsByTerm({ term: 'Boston' });
        expect(data.locations.length).toEqual(1);

        const firstLocation = data.locations[0];
        expect(firstLocation.id).toEqual('boston_ma_us');
        expect(firstLocation.name).toEqual('Boston');
        expect(firstLocation.slug).toEqual('boston-massachusetts-united-states');
        expect(firstLocation.code).toEqual('BOS');
        expect(firstLocation.type).toEqual('city');
      });

      it('should fetch locations for "LA" with Spanish locale, other location types, and a limit', async () => {
        const data = await searchLocationsByTerm({
          term: 'LA',
          locale: 'es-ES',
          locationTypes: [LOCATION_TYPES.AIRPORT, LOCATION_TYPES.CITY],
          limit: 3,
        });
        expect(data.locations.length).toEqual(3);

        const firstLocation = data.locations[0];
        expect(firstLocation.id).toEqual('las-vegas_nv_us');
        expect(firstLocation.name).toEqual('Las Vegas');
        expect(firstLocation.slug).toEqual('las-vegas-nevada-estados-unidos');
        expect(firstLocation.type).toEqual('city');
      });
    });

    describe('searchLocationsByRadius', () => {
      it('should fetch locations near New York City', async () => {
        const data = await searchLocationsByRadius({
          coordinate: {
            latitude: 40.7128,
            longitude: -74.0060,
          },
        });
        expect(data.locations.length).toBeGreaterThan(0);

        const firstLocation = data.locations[0];
        expect(firstLocation.id).toEqual('new-york-city_ny_us');
        expect(firstLocation.name).toEqual('New York City');
        expect(firstLocation.slug).toEqual('new-york-city-new-york-united-states');
        expect(firstLocation.type).toEqual('city');
      });

      it('should fetch airport locations near New York City', async () => {
        const data = await searchLocationsByRadius({
          coordinate: {
            latitude: 40.7128,
            longitude: -74.0060,
          },
          radius: 100, // 100 kilometers
          locale: 'es-ES',
          locationTypes: [LOCATION_TYPES.AIRPORT],
          limit: 2,
          sortTypes: [LOCATION_RESULTS_SORT_TYPES.ASCENDING_NAME],
        });

        expect(data.locations.length).toBeGreaterThan(0);
        expect(data.locations.length).toBeLessThan(3);

        const firstLocation = data.locations[0];
        expect(firstLocation.id).toEqual('JFK');
        expect(firstLocation.name).toEqual('Aeropuerto Internacional John F. Kennedy');
        expect(firstLocation.slug).toEqual('aeropuerto-internacional-john-f-kennedy-nueva-york-nueva-york-estados-unidos');
        expect(firstLocation.type).toEqual('airport');
      });
    });

    describe('getLocationById', () => {
      it('should get Logan Airport', async () => {
        const data = await getLocationById({ id: 'BOS' });

        expect(data.locations.length).toEqual(1);

        const logan = data.locations[0];
        expect(logan.id).toEqual('BOS');
        expect(logan.code).toEqual('BOS');
        expect(logan.name).toEqual('Logan International');
        expect(logan.type).toEqual('airport');
      });

      it('should get Logan Airport in Spanish', async () => {
        const data = await getLocationById({ id: 'BOS', locale: 'es-ES' });

        expect(data.locations.length).toEqual(1);

        const logan = data.locations[0];

        expect(logan.id).toEqual('BOS');
        expect(logan.code).toEqual('BOS');
        expect(logan.name).toEqual('Aeropuerto Internacional Logan');
        expect(logan.type).toEqual('airport');
      });
    });

    describe('getAirlines', () => {
      it('should get airlines', async () => {
        const expectedAirlines = [
          {
            id: 'B6',
            lcc: '1',
            name: 'JetBlue Airways',
          },
        ];

        const data = await getAirlines();

        expect(data.length).toBeGreaterThan(0);
        expect(data).toEqual(expect.arrayContaining(expectedAirlines));
      });
    });

    describe('searchFlights', () => {
      const today = moment();
      const weekFromToday = moment().add(7, 'days');
      const twoWeeksFromToday = moment().add(14, 'days');
      const threeWeeksFromToday = moment().add(21, 'days');

      const formattedToday = today.format('YYYY-MM-DD');
      const formattedWeekFromToday = weekFromToday.format('YYYY-MM-DD');
      const formattedTwoWeeksFromToday = twoWeeksFromToday.format('YYYY-MM-DD');
      const formattedThreeWeeksFromToday = threeWeeksFromToday.format('YYYY-MM-DD');

      const departureIdentifier = 'BOS';
      const arrivalIdentifier = 'LON';

      const departureDateTimeRange = {
        days: {
          start: formattedToday,
          end: formattedWeekFromToday,
        },
        timeOfDay: {
          start: '01:23',
          end: '23:45',
        },
      };
      const returnDepartureDateTimeRange = {
        days: {
          start: formattedTwoWeeksFromToday,
          end: formattedThreeWeeksFromToday,
        },
        timeOfDay: {
          start: '01:23',
          end: '23:45',
        },
      };

      const maximumHoursInFlight = 10;
      const passengerCount = 2;
      const directFlightsOnly = true;
      const currencyCode = 'USD';
      const priceRange = {
        start: 250,
        end: 10000,
      };
      const airlinesFilter = {
        airlines: ['WW', 'D8'],
        type: AIRLINES_FILTER_TYPE.EXCLUDE,
      };
      const locale = 'es-ES';
      const limit = 2;
      const sortType = FLIGHT_RESULTS_SORT_TYPES.PRICE;

      xit('should search one-way flights from BOS to LON', async () => {
        const results = await searchFlights({
          departureIdentifier,
          arrivalIdentifier,
          departureDateTimeRange,
        });
        expect(results).toEqual(expect.objectContaining({
          search_params: expect.objectContaining({
            to_type: 'anywhere',
            flyFrom_type: 'airport',
            seats: {
              infants: 0,
              passengers: 1,
              adults: 1,
              children: 0,
            },
          }),
          connections: [],
          currency: 'EUR',
          currency_rate: 1,
          all_stopover_airports: [],
          data: expect.any(Array),
          ref_tasks: [],
          refresh: [],
          del: 0,
          all_airlines: expect.any(Array),
          time: 1,
        }));
      });

      it('should search round-trip flights from BOS to LON', async () => {
        const results = await searchFlights({
          departureIdentifier,
          arrivalIdentifier,
          departureDateTimeRange,
          returnDepartureDateTimeRange,
          passengerCount,
          directFlightsOnly,
          maximumHoursInFlight,
          currencyCode,
          priceRange,
          airlinesFilter,
          locale,
          limit,
          sortType,
        });

        expect(results).toEqual(expect.objectContaining({
          search_params: expect.objectContaining({
            to_type: 'airport',
            flyFrom_type: 'airport',
            seats: {
              infants: 0,
              passengers: 2,
              adults: 2,
              children: 0,
            },
          }),
          connections: [],
          currency: 'USD',
          all_stopover_airports: [],
          data: expect.any(Array),
          ref_tasks: [],
          refresh: [],
          del: 0,
          all_airlines: expect.any(Array),
          time: 1,
        }));
        expect(results.data.length).toBeGreaterThan(0);
        expect(results.data.length).toBeLessThanOrEqual(limit);
      });
    });
  });
});
