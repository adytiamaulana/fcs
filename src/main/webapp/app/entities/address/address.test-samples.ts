import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 6566,
};

export const sampleWithPartialData: IAddress = {
  id: 32170,
  country: 'South Sudan',
  province: 'furlough haw',
  district: 'whereas layer',
  updatedBy: 'who',
};

export const sampleWithFullData: IAddress = {
  id: 7643,
  address: 'digest',
  country: 'Belgium',
  province: 'behind yowza consequently',
  city: 'Port Harvey',
  district: 'upon parent cabana',
  village: 'yippee vastly unless',
  postalCode: 21815,
  telephone: '393.534.3121 x11061',
  createdBy: 'since why',
  updatedBy: 'skinny woefully coverage',
  deletedBy: 'keyboard before',
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
