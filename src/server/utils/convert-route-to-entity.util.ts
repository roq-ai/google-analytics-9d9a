const mapping: Record<string, string> = {
  analyses: 'analysis',
  'google-analytics': 'google_analytics',
  organizations: 'organization',
  questions: 'question',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
