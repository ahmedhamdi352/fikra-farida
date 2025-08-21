interface OrderItem {
  name: string;
  colors: string;
  price: number;
  quantity: number;
}

interface BillingInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  governorate: string;
  phoneNumber: string;
  email: string;
}

export interface OrderPayloadForCreateDto {
  total: number;
  subTotal: number;
  discount: number;
  shipping: number;
  activeStep: number;
  totalItems: number;
  status: string;
  items: OrderItem[];
  billing: BillingInfo;
  countryCode: string;
  domain: string;
  paymentMethod: string;
}

export interface ApplyDiscountParams {
  discountCode: string;
  totalPrice: number;
  isCash: boolean;
  countryCode: string;
  domain: string;
}

export interface ResultOrderForReadDto extends OrderPayloadForCreateDto {
  orderId: string;
  id: number;
}

export interface CreateOrderDto {
  total: number;
  subTotal: number;
  discount: number;
  shipping: number;
  totalItems: number;
  items: OrderItem[];
  billing: BillingInfo;
  countryCode: string;
  domain: string;
}

interface Discount {
  DiscountId: number;
  Name: string;
  Code: string;
  Amount: number;
  IsPercentage: boolean;
  StartDate: string;
  EndDate: string;
  Description: string | null;
  IsActive: boolean;
  ApplyTo: number;
}

export interface DiscountResponse {
  isValid: boolean;
  message: string | null;
  priceAfterDiscount: number;
  totalDiscount: number;
  discount: Discount;
}
