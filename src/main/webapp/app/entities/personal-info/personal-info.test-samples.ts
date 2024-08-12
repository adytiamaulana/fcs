import dayjs from 'dayjs/esm';

import { IPersonalInfo, NewPersonalInfo } from './personal-info.model';

export const sampleWithRequiredData: IPersonalInfo = {
  id: 425,
  createdBy: 'from between willfully',
  createdAt: dayjs('2024-08-12T11:00'),
};

export const sampleWithPartialData: IPersonalInfo = {
  id: 14251,
  birthDate: 'whoa',
  createdBy: 'though',
  createdAt: dayjs('2024-08-11T16:17'),
  updatedBy: 'as meh',
};

export const sampleWithFullData: IPersonalInfo = {
  id: 22831,
  name: 'truly colorless',
  gender: 'likewise crayon beneath',
  birthDate: 'whoa retrospective',
  telephone: '853.988.8505 x257',
  branch: 26228,
  createdBy: 'excluding second devoted',
  createdAt: dayjs('2024-08-12T13:05'),
  updatedBy: 'duh scrawny',
  updatedAt: dayjs('2024-08-12T04:51'),
  deletedBy: 'sturdy that',
  deletedAt: dayjs('2024-08-12T04:14'),
};

export const sampleWithNewData: NewPersonalInfo = {
  createdBy: 'yuck outside',
  createdAt: dayjs('2024-08-11T14:33'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
