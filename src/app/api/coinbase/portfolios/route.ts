// src/app/api/coinbase/portfolios/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function generateHeaders(method: string, requestPath: string, body: string = '') {
  const accessKey = process.env.COINBASE_ACCESS_KEY?.trim();
  const signingKey = process.env.COINBASE_SIGNING_KEY?.trim();
  const passphrase = process.env.COINBASE_PASSPHRASE?.trim();

  if (!accessKey || !signingKey || !passphrase) {
    throw new Error('Missing required Coinbase credentials');
  }

  // Generate timestamp
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Construct the prehash string exactly as Postman does
  const prehash = `${timestamp}${method.toUpperCase()}${requestPath}${body}`;

  console.log('Prehash components:', {
    timestamp,
    method: method.toUpperCase(),
    requestPath,
    bodyLength: body.length,
    prehashLength: prehash.length
  });

  // Generate signature using Base64 encoding (matching Postman)
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(prehash)
    .digest('base64');  // Changed from hex to base64

  // Log lengths for verification
  console.log('Generated values:', {
    timestamp,
    signatureLength: signature.length
  });

  // Return headers with exact casing as shown in Postman
  return {
    'x-cb-access-key': accessKey,           // Changed casing to match Postman
    'x-cb-access-signature': signature,      // Changed casing to match Postman
    'x-cb-access-timestamp': timestamp,      // Changed casing to match Postman
    'x-cb-access-passphrase': passphrase,    // Changed casing to match Postman
    'Content-Type': 'application/json'
  };
}

export async function GET() {
  try {
    const requestPath = '/v1/portfolios';
    const method = 'GET';
    const headers = generateHeaders(method, requestPath);

    console.log('Making request with headers:', {
      url: 'https://api.prime.coinbase.com' + requestPath,
      method,
      headerKeys: Object.keys(headers)
    });

    const response = await fetch('https://api.prime.coinbase.com' + requestPath, {
      method,
      headers,
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${responseText}`);
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error('Coinbase API Error:', {
      message: error.message,
      status: error.status,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}