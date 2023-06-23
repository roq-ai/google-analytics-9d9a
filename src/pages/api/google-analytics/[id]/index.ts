import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { googleAnalyticsValidationSchema } from 'validationSchema/google-analytics';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.google_analytics
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getGoogleAnalyticsById();
    case 'PUT':
      return updateGoogleAnalyticsById();
    case 'DELETE':
      return deleteGoogleAnalyticsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGoogleAnalyticsById() {
    const data = await prisma.google_analytics.findFirst(convertQueryToPrismaUtil(req.query, 'google_analytics'));
    return res.status(200).json(data);
  }

  async function updateGoogleAnalyticsById() {
    await googleAnalyticsValidationSchema.validate(req.body);
    const data = await prisma.google_analytics.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteGoogleAnalyticsById() {
    const data = await prisma.google_analytics.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
