import dayjs from 'dayjs/esm';
import { IAddress } from 'app/entities/address/address.model';
import { ICardType } from 'app/entities/card-type/card-type.model';

export interface IPersonalInfo {
  id: number;
  name?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  telephone?: string | null;
  createdBy?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  updatedAt?: dayjs.Dayjs | null;
  deletedBy?: string | null;
  deletedAt?: dayjs.Dayjs | null;
  address?: IAddress | null;
  cardType?: ICardType | null;
}

export type NewPersonalInfo = Omit<IPersonalInfo, 'id'> & { id: null };
