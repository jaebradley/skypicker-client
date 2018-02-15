import {
  searchLocationsByTerm,
  searchLocationsByRadius,
  getLocationById,
  getAirlines,
} from './client';
import {
  LOCATION_TYPES,
  LOCATION_RESULTS_SORT_TYPES,
} from './constants';

describe('Client', () => {
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
  });
});
