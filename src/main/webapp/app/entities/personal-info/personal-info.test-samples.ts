import dayjs from 'dayjs/esm';

import { IPersonalInfo, NewPersonalInfo } from './personal-info.model';

export const sampleWithRequiredData: IPersonalInfo = {
  id: 18092,
};

export const sampleWithPartialData: IPersonalInfo = {
  id: 10481,
  name: 'or',
  createdAt: dayjs('2024-08-12T07:41'),
  deletedBy: 'pfft',
};

export const sampleWithFullData: IPersonalInfo = {
  id: 136,
  name: 'charset currency',
  gender: 'lest questionably',
  birthDate: 'yowza',
  telephone: '891.471.6799 x1210',
  branch: 29333,
  createdBy: 'pfft cork',
  createdAt: dayjs('2024-08-12T03:28'),
  updatedBy: 'married ugh',
  updatedAt: dayjs('2024-08-11T14:19'),
  deletedBy: 'with teeming',
  deletedAt: dayjs('2024-08-12T01:38'),
};

export const sampleWithNewData: NewPersonalInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
