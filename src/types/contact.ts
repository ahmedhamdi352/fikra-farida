export interface ContactPayloadForCreateDto {
  token: string;
  to: string;
  subject: string;
  body: string;
}
