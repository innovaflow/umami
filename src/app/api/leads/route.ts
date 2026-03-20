import prisma from '@/lib/prisma';
import { parseRequest } from '@/lib/request';
import { json } from '@/lib/response';

export async function GET(request: Request) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  // Only admin can see leads
  if (!auth?.user?.isAdmin) {
    return json({ error: 'Unauthorized' }, 403);
  }

  const leads = await prisma.rawQuery(
    `SELECT id, nome, email, telefono, salone, tipo, messaggio,
            utm_source, utm_medium, utm_campaign, referrer, created_at
     FROM leads
     ORDER BY created_at DESC
     LIMIT 100`,
    {},
  );

  return json(leads);
}
