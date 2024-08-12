import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 11900,
};

export const sampleWithPartialData: IAddress = {
  id: 11503,
  country: 'Tokelau',
  postalCode: 16622,
  createdAt: 'haw minus',
};

export const sampleWithFullData: IAddress = {
  id: 26982,
  address: 'against',
  country: 'Antigua and Barbuda',
  province: 'out pace unexpectedly',
  city: 'Gorczanyboro',
  district: 'abaft to',
  village: 'eek yum',
  postalCode: 20741,
  telephone: '(609) 591-8539 x177',
  createdBy: 'vastly unless',
  createdAt: 'lest beyond',
  updatedBy: 'freak counsel knowingly',
  updatedAt: 'afterwards clack',
  deletedBy: 'deadly uh-huh',
  deletedAt: 'aw frantically although',
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
