interface OrderItem {
  name: string;
  colors: string;
  price: number;
  quantity: number;
}

interface BillingInfo {
  name: string;
  address: string;
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
}

export interface ResultOrderForReadDto extends OrderPayloadForCreateDto {
  orderId: string;
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
