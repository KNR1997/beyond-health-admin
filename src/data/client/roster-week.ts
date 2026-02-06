import { crudFactory } from '@/data/client/curd-factory';
import {
  CreateRosterInput,
  QueryOptions,
  Roster,
  RosterPaginator,
  RosterQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const rosterClient = {
  ...crudFactory<Roster, QueryOptions, CreateRosterInput>(
    API_ENDPOINTS.ROSTER_WEEKS,
  ),
  paginated: ({ name, ...params }: Partial<RosterQueryOptions>) => {
    return HttpClient.get<RosterPaginator>(API_ENDPOINTS.ROSTER_WEEKS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
