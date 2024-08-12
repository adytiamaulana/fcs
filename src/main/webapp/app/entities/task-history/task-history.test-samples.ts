import dayjs from 'dayjs/esm';

import { ITaskHistory, NewTaskHistory } from './task-history.model';

export const sampleWithRequiredData: ITaskHistory = {
  id: 5750,
};

export const sampleWithPartialData: ITaskHistory = {
  id: 6419,
  startDate: dayjs('2024-08-12T05:54'),
  endDate: dayjs('2024-08-11T18:15'),
};

export const sampleWithFullData: ITaskHistory = {
  id: 18659,
  startDate: dayjs('2024-08-11T22:44'),
  endDate: dayjs('2024-08-12T03:49'),
};

export const sampleWithNewData: NewTaskHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
