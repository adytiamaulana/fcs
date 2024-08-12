import { IApplicationStatus, NewApplicationStatus } from './application-status.model';

export const sampleWithRequiredData: IApplicationStatus = {
  id: 15835,
};

export const sampleWithPartialData: IApplicationStatus = {
  id: 22303,
  createdBy: 'preface capital pfft',
  updatedBy: 'fiddle',
  deletedAt: 'phooey wet soliloquize',
};

export const sampleWithFullData: IApplicationStatus = {
  id: 27618,
  code: 'possible',
  status: 'commerce negligee geez',
  createdBy: 'yellow immediately',
  createdAt: 'spruce',
  updatedBy: 'round spool lumbering',
  updatedAt: 'save',
  deletedBy: 'band geez',
  deletedAt: 'through',
};

export const sampleWithNewData: NewApplicationStatus = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
