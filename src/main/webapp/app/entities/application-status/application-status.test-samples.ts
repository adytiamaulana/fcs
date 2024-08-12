import { IApplicationStatus, NewApplicationStatus } from './application-status.model';

export const sampleWithRequiredData: IApplicationStatus = {
  id: 1941,
};

export const sampleWithPartialData: IApplicationStatus = {
  id: 13475,
  code: 'yowza mortified phooey',
  status: 'out utterly phooey',
  createdBy: 'absolute tepid sway',
};

export const sampleWithFullData: IApplicationStatus = {
  id: 20967,
  code: 'commerce negligee geez',
  status: 'yellow immediately',
  createdBy: 'spruce',
  updatedBy: 'round spool lumbering',
  deletedBy: 'save',
};

export const sampleWithNewData: NewApplicationStatus = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
