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
  createdAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
