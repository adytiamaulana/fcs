export interface ICardType {
  id: number;
  cardCode?: number | null;
  cardName?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
}

export type NewCardType = Omit<ICardType, 'id'> & { id: null };
