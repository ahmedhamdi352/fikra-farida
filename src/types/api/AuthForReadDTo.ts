export type AuthForReadDTo = {
  token: string | null;
  expire_date: string;
  sucess: boolean;
  errorcode: number;
  message: string;
};

export type ResultForReadDTo = {
  sucess: boolean;
  errorcode: number;
  message: string;
};
