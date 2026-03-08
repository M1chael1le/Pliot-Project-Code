import { EquipmentStatus } from './index';

export type ApiSuccessResponse<T> = { data: T };
export type ApiErrorResponse = { error: string };

export interface CollectEquipmentBody {
  managerId: string;
  notes?: string;
}

export interface UpdateStatusBody {
  status: EquipmentStatus;
  managerId: string;
}
