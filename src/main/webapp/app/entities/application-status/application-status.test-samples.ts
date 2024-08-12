import dayjs from 'dayjs/esm';

import { IApplicationStatus, NewApplicationStatus } from './application-status.model';

export const sampleWithRequiredData: IApplicationStatus = {
  id: 22459,
  code: 'but ew',
  createdBy: 'glimmering generally intensely',
  createdAt: dayjs('2024-08-11T22:04'),
};

export const sampleWithPartialData: IApplicationStatus = {
  id: 12394,
  code: 'collude',
  status: 'gosh gruesome combat',
  createdBy: 'without even instead',
  createdAt: dayjs('2024-08-12T06:19'),
  updatedBy: 'batter ew generous',
  updatedAt: dayjs('2024-08-11T13:58'),
  deletedBy: 'bah enchanted',
  deletedAt: dayjs('2024-08-11T14:54'),
};

export const sampleWithFullData: IApplicationStatus = {
  id: 32032,
  code: 'mar contract intently',
  status: 'rudely bravely',
  createdBy: 'gee creative action',
  createdAt: dayjs('2024-08-11T21:05'),
  updatedBy: 'scrawny lest',
  updatedAt: dayjs('2024-08-11T23:00'),
  deletedBy: 'across greatly fairly',
  deletedAt: dayjs('2024-08-11T18:04'),
};

export const sampleWithNewData: NewApplicationStatus = {
  code: 'actress',
  createdBy: 'imagine frenetically whereas',
  createdAt: dayjs('2024-08-12T11:01'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
