import dayjs from 'dayjs/esm';

import { IApplicationStatus, NewApplicationStatus } from './application-status.model';

export const sampleWithRequiredData: IApplicationStatus = {
  id: 15835,
};

export const sampleWithPartialData: IApplicationStatus = {
  id: 22303,
  createdBy: 'preface capital pfft',
  updatedBy: 'fiddle',
  deletedAt: dayjs('2024-08-11T18:28'),
};

export const sampleWithFullData: IApplicationStatus = {
  id: 4174,
  code: 'barring',
  status: 'frightfully reassuringly',
  createdBy: 'immaterial under round',
  createdAt: dayjs('2024-08-12T12:49'),
  updatedBy: 'brr acidly consequently',
  updatedAt: dayjs('2024-08-12T00:31'),
  deletedBy: 'circa goddess',
  deletedAt: dayjs('2024-08-11T17:53'),
};

export const sampleWithNewData: NewApplicationStatus = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
