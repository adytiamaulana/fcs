import dayjs from 'dayjs/esm';

import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 11900,
};

export const sampleWithPartialData: IAddress = {
  id: 11503,
  country: 'Tokelau',
  postalCode: 16622,
  createdAt: dayjs('2024-08-12T05:04'),
};

export const sampleWithFullData: IAddress = {
  id: 12083,
  address: 'geez oh against',
  country: 'Antigua and Barbuda',
  province: 'out pace unexpectedly',
  city: 'Gorczanyboro',
  district: 'abaft to',
  village: 'eek yum',
  postalCode: 20741,
  telephone: '(609) 591-8539 x177',
  createdBy: 'vastly unless',
  createdAt: dayjs('2024-08-11T22:04'),
  updatedBy: 'indeed outside freak',
  updatedAt: dayjs('2024-08-12T08:53'),
  deletedBy: 'why supposing',
  deletedAt: dayjs('2024-08-11T19:49'),
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
