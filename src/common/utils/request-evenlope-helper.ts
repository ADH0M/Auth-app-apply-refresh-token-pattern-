import type { User } from "../../generated/prisma/client";
import type { ApiMeta, ApiSuccess } from "../types/common";

// 200
export const ok = <T>(data: T, meta?: unknown): ApiSuccess<T> => {
  return meta !== undefined
    ? { success: true, data, meta }
    : { success: true, data };
};

// 201
export const created = <T>(data: T): ApiSuccess<T> => {
  return { success: true, data };
};

// metadata
export const pagenated = <T>(
  data: T[],
  meta: ApiMeta,
): { success: boolean; data: T[]; meta: ApiMeta } => {
  return { success: true, data, meta };
};

// omit password 
export function omitPassword(data:User):Omit<User ,"passwordHash">{
const {passwordHash:_PH,...safe} = data;
void _PH;
return safe
}