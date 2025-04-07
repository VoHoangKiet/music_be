import { Response } from 'express';

export interface ErrorDetail {
  errorCode: string | number;
  errorMessage: string;
}

export interface BodyResponse {
  httpStatusCode: number;
  data?: any;
  errors?: ErrorDetail[];
}
export interface UserInfo {
  email: string;
  uid: string;
  role: string;
}

export type ResponseCustom = Response<BodyResponse>;
