import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 18992,
  login: "!ZIrM.@HN0T\\/OL\\yF\\b1Tz5hb\\KHsc\\'U-",
};

export const sampleWithPartialData: IUser = {
  id: 19252,
  login: 'mQ',
};

export const sampleWithFullData: IUser = {
  id: 23118,
  login: 'kDm$@LO\\jr1V',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
