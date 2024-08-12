import { ICardType, NewCardType } from './card-type.model';

export const sampleWithRequiredData: ICardType = {
  id: 6766,
};

export const sampleWithPartialData: ICardType = {
  id: 7547,
  cardCode: 26431,
  cardName: 'alley married deficit',
  deletedBy: 'misgovern',
};

export const sampleWithFullData: ICardType = {
  id: 22917,
  cardCode: 28235,
  cardName: 'dose in',
  createdBy: 'aside mellow supposing',
  updatedBy: 'while awkwardly boohoo',
  deletedBy: 'gregarious jubilantly',
};

export const sampleWithNewData: NewCardType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
