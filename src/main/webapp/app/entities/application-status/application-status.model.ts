export interface IApplicationStatus {
  id: number;
  code?: string | null;
  status?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type NewApplicationStatus = Omit<IApplicationStatus, 'id'> & { id: null };
