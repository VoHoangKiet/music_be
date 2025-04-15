import { Request, Response } from 'express';

export interface ErrorDetail {
  errorCode: string;
  errorMessage: string;
}

export interface BodyResponse {
  httpStatusCode: number;
  data?: any;
  errors?: ErrorDetail[] | ErrorDetail;
}

export type ResponseCustom = Response<BodyResponse>;

export interface UserInfo {
  email: string;
  uid: string;
  role: string;
}

export type RequestCustom = Request & { userInfo: UserInfo, data: any };
