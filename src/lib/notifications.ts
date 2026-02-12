import { db } from './db';
import { encryptText } from './crypto';

export async function scheduleReminder({
  userId,
  title,
  body,
  channel = 'EMAIL',
  scheduledAt,
}: {
  userId: string;
  title: string;
  body: string;
  channel?: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
  scheduledAt: Date;
}) {
  return db.notification.create({
    data: {
      userId,
      title,
      bodyEncrypted: encryptText(body),
      channel,
      scheduledAt,
    },
  });
}
