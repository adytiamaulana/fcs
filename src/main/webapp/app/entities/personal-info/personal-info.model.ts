import { IAddress } from 'app/entities/address/address.model';
import { ICardType } from 'app/entities/card-type/card-type.model';

export interface IPersonalInfo {
  id: number;
  name?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  telephone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  address?: IAddress | null;
  cardType?: ICardType | null;
}

export type NewPersonalInfo = Omit<IPersonalInfo, 'id'> & { id: null };
