import { crudFactory } from '@/data/client/curd-factory';
import {
  QueryOptions,
  Shift,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

export const shiftClient = {
  ...crudFactory<Shift, QueryOptions, {}>(
    API_ENDPOINTS.SHIFTS,
  ),
};
