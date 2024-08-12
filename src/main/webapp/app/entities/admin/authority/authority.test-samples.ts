import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'f7defcbb-4019-4acf-920f-2897baa9db6f',
};

export const sampleWithPartialData: IAuthority = {
  name: '35aab71d-c4e6-435d-8597-84a0e41c0d50',
};

export const sampleWithFullData: IAuthority = {
  name: '0dc7e564-5158-458c-9f32-59abf6a1fdd1',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
