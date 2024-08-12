import dayjs from 'dayjs/esm';

import { IPersonalInfo, NewPersonalInfo } from './personal-info.model';

export const sampleWithRequiredData: IPersonalInfo = {
  id: 21047,
};

export const sampleWithPartialData: IPersonalInfo = {
  id: 6354,
  gender: 'below complaint bathrobe',
  updatedAt: dayjs('2024-08-12'),
};

export const sampleWithFullData: IPersonalInfo = {
  id: 24364,
  name: 'unlock',
  gender: 'considering macaroni',
  birthDate: 'rapidly carter within',
  telephone: '(410) 959-1552',
  createdBy: 'duh purloin',
  createdAt: dayjs('2024-08-11'),
  updatedBy: 'excursion sculpting',
  updatedAt: dayjs('2024-08-11'),
  deletedBy: 'thankfully hypothesise',
  deletedAt: dayjs('2024-08-11'),
};

export const sampleWithNewData: NewPersonalInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
