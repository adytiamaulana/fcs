import dayjs from 'dayjs/esm';

import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 13603,
  createdBy: 'zucchini absentmindedly since',
  createdAt: dayjs('2024-08-12T09:39'),
};

export const sampleWithPartialData: IAddress = {
  id: 25063,
  address: 'concerned incidentally spend',
  country: 'El Salvador',
  province: 'tide harass consequently',
  city: 'Quincy',
  district: 'blah beckon',
  village: 'above qua',
  createdBy: 'if',
  createdAt: dayjs('2024-08-11T16:35'),
  updatedAt: dayjs('2024-08-11T20:59'),
  deletedBy: 'outside',
};

export const sampleWithFullData: IAddress = {
  id: 15253,
  address: 'mortally shoddy but',
  country: 'Heard Island and McDonald Islands',
  province: 'yahoo',
  city: 'Palatine',
  district: 'or raise despite',
  village: 'boohoo relapse',
  postalCode: 30682,
  telephone: '1-490-794-3124 x732',
  createdBy: 'detain aside midst',
  createdAt: dayjs('2024-08-12T04:49'),
  updatedBy: 'short along',
  updatedAt: dayjs('2024-08-12T12:04'),
  deletedBy: 'poorly whereas',
  deletedAt: dayjs('2024-08-12T06:01'),
};

export const sampleWithNewData: NewAddress = {
  createdBy: 'aw loudly considering',
  createdAt: dayjs('2024-08-11T15:06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
