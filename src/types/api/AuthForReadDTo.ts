export interface Profile {
  userPk: number;
  username: string;
  fullname: string;
  imageFilename: string;
  token: string;
  expire_date: string;
  isDefault: boolean;
}

export type AuthForReadDTo = {
  token: string | null;
  expire_date: string;
  profiles: Profile[];
  sucess: boolean;
  errorcode: number;
  message: string | null;
};

export type ResultForReadDTo = {
  sucess: boolean;
  errorcode: number;
  message: string;
};
