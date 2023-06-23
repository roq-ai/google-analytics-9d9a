import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { googleAnalyticsValidationSchema } from 'validationSchema/google-analytics';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getGoogleAnalytics();
    case 'POST':
      return createGoogleAnalytics();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGoogleAnalytics() {
    const data = await prisma.google_analytics
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'google_analytics'));
    return res.status(200).json(data);
  }

  async function createGoogleAnalytics() {
    await googleAnalyticsValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.google_analytics.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
