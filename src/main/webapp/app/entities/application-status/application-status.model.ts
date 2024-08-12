export interface IApplicationStatus {
  id: number;
  code?: string | null;
  status?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
}

export type NewApplicationStatus = Omit<IApplicationStatus, 'id'> & { id: null };
