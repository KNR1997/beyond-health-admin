import {
  StoreNotice,
  StoreNoticeInput,
  StoreNoticePaginator,
  StoreNoticeQueryOptions,
  UserNotification,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const notificationClient = {
  ...crudFactory<UserNotification, any, StoreNoticeInput>(
    API_ENDPOINTS.NOTIFICATIONS,
  ),
  paginated: ({
    notice,
    shops,
    ...params
  }: Partial<StoreNoticeQueryOptions>) => {
    return HttpClient.get<StoreNoticePaginator>(API_ENDPOINTS.NOTIFICATIONS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({
        notice,
        shops,
        'users.id': params['users.id'],
      }),
    });
  },
  toggle: (input: { id: string; language?: string }) =>
    HttpClient.post<any>(API_ENDPOINTS.NOTIFICATIONS_IS_READ, input),
};
