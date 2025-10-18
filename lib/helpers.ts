import { hash } from "crypto";

export const isObject = (obj: any) => {
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    return true;
  }
  return false;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createMd5 = (data: string) => {
  return hash("md5", data);
};
