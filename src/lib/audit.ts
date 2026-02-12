import { db } from './db';

export async function logAudit({
  actorId,
  action,
  resource,
  resourceId,
  ipAddress,
  userAgent,
  metadata,
}: {
  actorId: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT';
  resource: string;
  resourceId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | string;
}) {
  await db.auditLog.create({
    data: {
      actorId,
      action,
      resource,
      resourceId,
      ipAddress: ipAddress ?? undefined,
      userAgent: userAgent ?? undefined,
      metadata: typeof metadata === 'string' ? metadata : metadata ? JSON.stringify(metadata) : undefined,
    },
  });
}
