export interface ProfileLink {
  pk: number;
  userpk: number;
  title: string;
  url: string;
  iconurl: string;
  sort: number;
  visitcount: number;
  type: number;
  Qrcode: string;
  lastIPvisit: string;
  lastIPvisitdate: string;
}

export interface ProfileForReadDTO {
  userPk: number;
  username: string;
  fullname: string;
  jobTitle: string;
  bio: string;
  email: string;
  phoneNumber1: string;
  address: string;
  imageFilename: string;
  type: number;
  keycount: number;
  createDate: string;
  modifedDate: string;
  links: ProfileLink[];
  lastIPvisit: string;
  lastIPvisitdate: string;
  visitcount: number;
  subscriptionEnddate: string;
  companyFk: number;
  theme: string;
}