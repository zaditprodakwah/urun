export async function sendWhatsappMessage(target: string, text: string): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.error('❌ FONNTE_TOKEN is missing in environment!');
    return false;
  }

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: new URLSearchParams({
        target: target,
        message: text,
      }),
    });

    const data = await res.json();
    if (data.status) {
      console.log(`✅ Message successfully sent to ${target}`);
      return true;
    } else {
      console.log(`❌ Fonnte error: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Failed to call Fonnte API:`, err);
    return false;
  }
}

/**
 * Sends a WhatsApp message in a non-blocking background task using Next.js waitUntil if available,
 * or standard background Promise execution, preventing serverless function termination issues.
 */
export function sendWhatsappMessageAsync(target: string, text: string): void {
  const p = sendWhatsappMessage(target, text)
    .then(success => {
      if (success) console.log(`📡 [Async WA] Sent successfully to ${target}`);
      else console.error(`📡 [Async WA] Failed to send to ${target}`);
    })
    .catch(err => {
      console.error(`📡 [Async WA] Error sending to ${target}:`, err);
    });

  // Check if Vercel / Next.js waitUntil is globally available in the current context
  try {
    import('next/server').then(({ waitUntil }) => {
      if (typeof waitUntil === 'function') {
        waitUntil(p);
      }
    }).catch(() => {});
  } catch {
    // Normal environment, promise runs in background
  }
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats a phone number to standard Indonensian international format (starts with 628)
 */
export function formatPhoneNumber(phone: string): string {
  let formatted = phone.trim();
  if (formatted.startsWith('08')) {
    formatted = '628' + formatted.slice(2);
  } else if (formatted.startsWith('+628')) {
    formatted = '628' + formatted.slice(4);
  } else if (formatted.startsWith('+')) {
    formatted = formatted.slice(1);
  }
  return formatted;
}
