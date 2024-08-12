import dayjs from 'dayjs/esm';

import { IApplicationStatus, NewApplicationStatus } from './application-status.model';

export const sampleWithRequiredData: IApplicationStatus = {
  id: 15835,
  code: 'bronze hopelessly profuse',
  createdBy: 'warmly wary',
  createdAt: dayjs('2024-08-12T08:09'),
};

export const sampleWithPartialData: IApplicationStatus = {
  id: 16032,
  code: 'why when drat',
  status: 'provided badly',
  createdBy: 'eject beyond',
  createdAt: dayjs('2024-08-12T05:44'),
  updatedAt: dayjs('2024-08-11T22:50'),
  deletedBy: 'geez yowza after',
  deletedAt: dayjs('2024-08-11T23:13'),
};

export const sampleWithFullData: IApplicationStatus = {
  id: 11602,
  code: 'spool lumbering drat',
  status: 'oof lacerate authentication',
  createdBy: 'brr',
  createdAt: dayjs('2024-08-11T20:16'),
  updatedBy: 'ouch',
  updatedAt: dayjs('2024-08-11T16:08'),
  deletedBy: 'clamber',
  deletedAt: dayjs('2024-08-11T15:16'),
};

export const sampleWithNewData: NewApplicationStatus = {
  code: 'at digitalize',
  createdBy: 'comment',
  createdAt: dayjs('2024-08-12T05:48'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
