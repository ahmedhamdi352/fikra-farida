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

export interface LinkedProduct {
  linkPk: number;
  userFk: number;
  linkCode: string;
  createDate: string;
  isLinked: boolean;
  linkDate: string;
  lcompanyFk: number;
  productId: string | null;
}

export interface ProfileForReadDTO {
  userPk: number;
  username: string;
  fullname: string;
  jobTitle: string;
  bio: string;
  phoneNumber1: string;
  address: string;
  imageFilename: string;
  createDate: string;
  modifedDate: string;
  links: ProfileLink[];
  LinkedProducts: LinkedProduct[];
  email: string;
  type: number;
  keycount: number;
  token: string;
  lastIPvisit: string;
  lastIPvisitdate: string;
  visitcount: number;
  subscriptionEnddate: string;
  companyFk: number;
  _companyFk: number;
  theme: string;
  ColorMode: string;
  IsLocked: boolean;
  directurl: string;
  autoconnect: boolean;
  accountFk: number;
  showEmail: boolean;
  showPhone: boolean;
  showWebsite: boolean;
  colorBackground: string;
  iconColor: string;
  saveContact: boolean;
}
