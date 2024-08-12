import { IPersonalInfo, NewPersonalInfo } from './personal-info.model';

export const sampleWithRequiredData: IPersonalInfo = {
  id: 21047,
};

export const sampleWithPartialData: IPersonalInfo = {
  id: 6354,
  gender: 'below complaint bathrobe',
  updatedAt: 'gadget',
};

export const sampleWithFullData: IPersonalInfo = {
  id: 4610,
  name: 'buffer authentic clearly',
  gender: 'um',
  birthDate: 'within',
  telephone: '(410) 959-1552',
  createdBy: 'duh purloin',
  createdAt: 'than sham',
  updatedBy: 'worrisome politely tenderly',
  updatedAt: 'geez',
  deletedBy: 'founder plot early',
  deletedAt: 'if leaker',
};

export const sampleWithNewData: NewPersonalInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
