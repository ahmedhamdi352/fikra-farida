export const ApiURLs = {
  login: 'api/Auth/login',
  forgetPassword: 'api/Account/ResetPassword',
  resetPassword: '/api/Account/ChangePassword',
  register: '/api/Account/Register',
  contact: '/api/Email/Send',
  order: '/api/ShoppingOrder/add',
  catergories: '/api/Store/Categories',
  myProfile: '/api/Account/MyProfile',
  QrCode: '/api/Media/QrCodebyUser',
  connections: '/api/UserConnection/MyConnections',
  groups: '/api/ConnectionGroup',
  links: '/api/CustomLink',
  discount: '/api/discount', // Updated to use our proxy endpoint
  lockStatus: '/api/Account/UpdateLockStatus',
  collectInfo: '/api/Account/UpdateAutoConnect',
  directLink: '/api/Account/UpdateDirectUrl',
} as const;
