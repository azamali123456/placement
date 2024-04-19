// response.ts
export type ResponseMessage = {
  status: boolean;
  message: string | null;
  data: Array<any>;
};

export const responseSuccessMessage = (
  message: any,
  data: any,
  statusCode: any,
): any => {
  return { status: true, message, data, statusCode: statusCode };
};

export const responseFailedMessage = (message: any): any => {
  return { status: false, message, statusCode: 400 };
};
