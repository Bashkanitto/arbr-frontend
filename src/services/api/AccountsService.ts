// src/services/api/AccountsService.ts
import { baseApi } from "./base";

export interface AccountType {
  status: string;
  id: number;
  createdAt: string;
  firstName: string;
  role: string;
}

interface MetaType {
  totalPages: number;
  page: number;
  total: number;
}

export const fetchAllAccounts = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{ records: AccountType[]; meta: MetaType }> => {
  try {
    const response: { meta: MetaType; records: AccountType[] } =
      await baseApi.get(
        `/account?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );
    return response;
  } catch (error) {
    console.error("Error fetching last confirmed accounts:", error);
    throw new Error("Failed to fetch last confirmed accounts");
  }
};

export const changeAccount = async (id: number, status: string) => {
  try {
    const response: any = await baseApi.patch(`/account/${id}`, {
      status,
    });
    return response;
  } catch (error) {
    console.error("Error fetching last confirmed accounts:", error);
    throw new Error("Failed to fetch last confirmed accounts");
  }
};

export const deleteAccount = async (
  id: number
): Promise<{ records: AccountType[]; meta: MetaType }> => {
  try {
    const response: any = await baseApi.delete(`/account/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching last confirmed accounts:", error);
    throw new Error("Failed to fetch last confirmed accounts");
  }
};
