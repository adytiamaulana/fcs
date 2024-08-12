import dayjs from 'dayjs/esm';

export interface IAddress {
  id: number;
  address?: string | null;
  country?: string | null;
  province?: string | null;
  city?: string | null;
  district?: string | null;
  village?: string | null;
  postalCode?: number | null;
  telephone?: string | null;
  createdBy?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedBy?: string | null;
  deletedAt?: dayjs.Dayjs | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
