import dayjs from 'dayjs/esm';

import { ITaskHistory, NewTaskHistory } from './task-history.model';

export const sampleWithRequiredData: ITaskHistory = {
  id: 24323,
};

export const sampleWithPartialData: ITaskHistory = {
  id: 26526,
  branch: 'evenly nerve where',
  startDate: dayjs('2024-08-12'),
  endDate: dayjs('2024-08-11'),
};

export const sampleWithFullData: ITaskHistory = {
  id: 17276,
  branch: 'fooey front',
  startDate: dayjs('2024-08-12'),
  endDate: dayjs('2024-08-12'),
};

export const sampleWithNewData: NewTaskHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
