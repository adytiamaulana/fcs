import dayjs from 'dayjs/esm';

import { ITaskHistory, NewTaskHistory } from './task-history.model';

export const sampleWithRequiredData: ITaskHistory = {
  id: 29528,
};

export const sampleWithPartialData: ITaskHistory = {
  id: 11746,
  startDate: dayjs('2024-08-11T21:37'),
  endDate: dayjs('2024-08-11T19:01'),
};

export const sampleWithFullData: ITaskHistory = {
  id: 11833,
  startDate: dayjs('2024-08-12T08:44'),
  endDate: dayjs('2024-08-12T10:26'),
};

export const sampleWithNewData: NewTaskHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
