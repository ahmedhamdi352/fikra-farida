import { createHmac } from 'crypto';


const stringToSign = "amount=504&channel=online%20%7C%20e-commerce&creationDate=2025-08-21T13%3A38%3A32.204Z&currency=EGP&kashierOrderId=ca12c9f0-8398-4928-9cda-55c3711d73aa&merchantOrderId=7bb29fa0-2eb5-405d-8c89-376c1047a42e&method=card&orderReference=TEST-ORD-193404918&status=SUCCESS&transactionId=TX-28577431145&transactionResponseCode=00";

// const encodedString = encodeURIComponent(stringToSign);


const secretKey = "ed840c8d-98ee-435a-a279-24f44c7af95b";


const receivedSignature = "f14bf28d05e381f50e4be8fbc058e8f029521c2013333dc07297ac937637b3d5";


const calculatedSignature = createHmac('sha256', secretKey)
  .update(stringToSign)
  .digest('hex');

console.log(`String to Sign:   "${stringToSign}"`);
// console.log(`Encoded String:  ${encodedString}`);
console.log(`Received Signature:  ${receivedSignature}`);
console.log(`Calculated Signature: ${calculatedSignature}`);
console.log('---');

if (receivedSignature === calculatedSignature) {
  console.log('✅ SUCCESS: The signatures match! The secret key is correct.');
} else {
  console.log('❌ FAILED: The signatures DO NOT match. The secret key is incorrect.');
}