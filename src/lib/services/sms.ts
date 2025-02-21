interface SMSParams {
  to: string;
  message: string;
}

export async function sendSMS({ to, message }: SMSParams) {
  // Using Africa's Talking SMS API
  const username = process.env.AFRICASTALKING_USERNAME;
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  
  const response = await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': apiKey!,
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      username: username!,
      to,
      message,
      from: process.env.AFRICASTALKING_SENDER_ID || 'COMMERCEPLATE'
    })
  });

  return response.json();
}
