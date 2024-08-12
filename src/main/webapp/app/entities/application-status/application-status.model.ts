import dayjs from 'dayjs/esm';

export interface IApplicationStatus {
  id: number;
  code?: string | null;
  status?: string | null;
  createdBy?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedBy?: string | null;
  deletedAt?: dayjs.Dayjs | null;
}

export type NewApplicationStatus = Omit<IApplicationStatus, 'id'> & { id: null };
