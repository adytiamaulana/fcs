import { IPersonalInfo, NewPersonalInfo } from './personal-info.model';

export const sampleWithRequiredData: IPersonalInfo = {
  id: 17359,
};

export const sampleWithPartialData: IPersonalInfo = {
  id: 24694,
  name: 'example whoever consequently',
  createdBy: 'ouch celsius',
};

export const sampleWithFullData: IPersonalInfo = {
  id: 31126,
  name: 'considering macaroni',
  gender: 'rapidly carter within',
  birthDate: 'caffeine',
  telephone: '(625) 432-0786 x2465',
  createdBy: 'given harmonize with',
  updatedBy: 'masculine over wrongly',
  deletedBy: 'geez',
};

export const sampleWithNewData: NewPersonalInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
