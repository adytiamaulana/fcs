import { IPersonalInfo } from 'app/entities/personal-info/personal-info.model';
import { IApplicationStatus } from 'app/entities/application-status/application-status.model';

export interface ITaskHistory {
  id: number;
  branch?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  personalInfo?: IPersonalInfo | null;
  applicationStatus?: IApplicationStatus | null;
}

export type NewTaskHistory = Omit<ITaskHistory, 'id'> & { id: null };
