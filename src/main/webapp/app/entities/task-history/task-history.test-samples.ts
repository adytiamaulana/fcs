import { ITaskHistory, NewTaskHistory } from './task-history.model';

export const sampleWithRequiredData: ITaskHistory = {
  id: 3472,
};

export const sampleWithPartialData: ITaskHistory = {
  id: 26913,
  branch: 'shadow',
  endDate: 'phooey outclass who',
};

export const sampleWithFullData: ITaskHistory = {
  id: 17239,
  branch: 'beyond mass',
  startDate: 'allegation peel distress',
  endDate: 'meaningfully afore',
};

export const sampleWithNewData: NewTaskHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
