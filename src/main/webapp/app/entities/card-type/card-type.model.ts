export interface ICardType {
  id: number;
  cardCode?: number | null;
  cardName?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type NewCardType = Omit<ICardType, 'id'> & { id: null };
