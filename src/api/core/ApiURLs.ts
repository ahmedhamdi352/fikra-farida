export const ApiURLs = {
  login: 'api/Auth/login',
  forgetPassword: 'api/Account/ResetPassword',
  resetPassword: '/api/Account/ChangePassword',
  register: '/api/Account/Register',
  contact: '/api/Email/Send',
  order: '/api/ShoppingOrder/add',
  catergories: '/api/Store/Categories',
} as const;
