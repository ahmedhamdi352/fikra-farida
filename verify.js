import { createHmac } from 'crypto';


const stringToSign = "504online | e-commerce2025-08-21T13:19:44.314ZEGP866fb9b7-6ecd-4e0b-80db-e766b83453cd6eb3575a-df13-4d03-a814-6eaf38cb437acardTEST-ORD-193404912SUCCESSTX-2857743114100";

const encodedString = encodeURIComponent(stringToSign);


const secretKey = "ed840c8d-98ee-435a-a279-24f44c7af95b";


const receivedSignature = "060646d86996d33b2ac404e9e9d3ef8eba0fcb6c332e6f1ebeb7c26d0481064d";


const calculatedSignature = createHmac('sha256', secretKey)
  .update(encodedString)
  .digest('hex');

console.log(`String to Sign:   "${stringToSign}"`);
console.log(`Encoded String:  ${encodedString}`);
console.log(`Received Signature:  ${receivedSignature}`);
console.log(`Calculated Signature: ${calculatedSignature}`);
console.log('---');

if (receivedSignature === calculatedSignature) {
  console.log('✅ SUCCESS: The signatures match! The secret key is correct.');
} else {
  console.log('❌ FAILED: The signatures DO NOT match. The secret key is incorrect.');
}