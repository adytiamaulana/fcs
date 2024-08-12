import dayjs from 'dayjs/esm';

import { ICardType, NewCardType } from './card-type.model';

export const sampleWithRequiredData: ICardType = {
  id: 26641,
};

export const sampleWithPartialData: ICardType = {
  id: 14907,
  cardName: 'moonwalk crafty',
  createdBy: 'detoxify',
  updatedAt: dayjs('2024-08-12T06:59'),
  deletedBy: 'gosh mistreat',
  deletedAt: dayjs('2024-08-12T08:22'),
};

export const sampleWithFullData: ICardType = {
  id: 23688,
  cardCode: 16431,
  cardName: 'aside mellow supposing',
  createdBy: 'while awkwardly boohoo',
  createdAt: dayjs('2024-08-12T06:09'),
  updatedBy: 'bandage',
  updatedAt: dayjs('2024-08-12T01:01'),
  deletedBy: 'yummy though if',
  deletedAt: dayjs('2024-08-12T05:19'),
};

export const sampleWithNewData: NewCardType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
