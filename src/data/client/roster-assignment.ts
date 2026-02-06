import { crudFactory } from '@/data/client/curd-factory';
import {
  CreateRosterAssignmentInput,
  QueryOptions,
  Roster,
  RosterAssignment,
  RosterPaginator,
  RosterQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const rosterAssignmentClient = {
  ...crudFactory<Roster, QueryOptions, CreateRosterAssignmentInput>(
    API_ENDPOINTS.ROSTER_ASSIGNMENTS,
  ),
  create: (data: CreateRosterAssignmentInput) => {
    return HttpClient.post<RosterAssignment>(
      `${API_ENDPOINTS.ROSTER_WEEKS}/${data.roster_week}/assignments`,
      data,
    );
  },
  // paginated: ({ name, ...params }: Partial<RosterQueryOptions>) => {
  //   return HttpClient.get<RosterPaginator>(API_ENDPOINTS.ROSTER_WEEKS, {
  //     searchJoin: 'and',
  //     ...params,
  //     search: HttpClient.formatSearchParams({ name }),
  //   });
  // },
  // assignments: (rosterWeekId: string) => {
  //   return HttpClient.get<RosterAssignment[]>(
  //     `${API_ENDPOINTS.ROSTER_WEEKS}/${rosterWeekId}/assignments`,
  //   );
  // },
};
