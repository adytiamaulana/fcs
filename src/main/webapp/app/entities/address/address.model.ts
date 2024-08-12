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
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
