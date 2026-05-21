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
      console.error(`❌ Fonnte error: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Failed to call Fonnte API:`, err);
    return false;
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
