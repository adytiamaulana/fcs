import { ICardType, NewCardType } from './card-type.model';

export const sampleWithRequiredData: ICardType = {
  id: 26641,
};

export const sampleWithPartialData: ICardType = {
  id: 14907,
  cardName: 'moonwalk crafty',
  createdBy: 'detoxify',
  updatedAt: 'fatherly tote',
  deletedBy: 'throughout mmm',
  deletedAt: 'thankful though meanwhile',
};

export const sampleWithFullData: ICardType = {
  id: 596,
  cardCode: 5798,
  cardName: 'yesterday',
  createdBy: 'lawmaker',
  createdAt: 'jubilantly fervently',
  updatedBy: 'categorize of',
  updatedAt: 'as reactant pace',
  deletedBy: 'blabber',
  deletedAt: 'zowie short-term',
};

export const sampleWithNewData: NewCardType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
