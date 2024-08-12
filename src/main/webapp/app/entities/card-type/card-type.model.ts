import dayjs from 'dayjs/esm';

export interface ICardType {
  id: number;
  cardCode?: number | null;
  cardName?: string | null;
  createdBy?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedBy?: string | null;
  deletedAt?: dayjs.Dayjs | null;
}

export type NewCardType = Omit<ICardType, 'id'> & { id: null };
