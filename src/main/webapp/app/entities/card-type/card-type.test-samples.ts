import dayjs from 'dayjs/esm';

import { ICardType, NewCardType } from './card-type.model';

export const sampleWithRequiredData: ICardType = {
  id: 5136,
  cardCode: 19151,
  createdBy: 'kissingly disaffiliate',
  createdAt: dayjs('2024-08-12T00:24'),
};

export const sampleWithPartialData: ICardType = {
  id: 19924,
  cardCode: 19135,
  cardName: 'demanding long-term bowlful',
  createdBy: 'philanthropy',
  createdAt: dayjs('2024-08-12T10:11'),
  deletedBy: 'meatloaf',
};

export const sampleWithFullData: ICardType = {
  id: 20576,
  cardCode: 25334,
  cardName: 'whose academic',
  createdBy: 'knotty',
  createdAt: dayjs('2024-08-12T08:41'),
  updatedBy: 'macaw manipulation',
  updatedAt: dayjs('2024-08-12T12:35'),
  deletedBy: 'surname whoa anenst',
  deletedAt: dayjs('2024-08-11T17:12'),
};

export const sampleWithNewData: NewCardType = {
  cardCode: 5938,
  createdBy: 'mid',
  createdAt: dayjs('2024-08-11T17:21'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
