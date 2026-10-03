type AnalyticsRow = {
  timestamp: string;
  pageviews: number;
  visitors: number;
};

type AnalyticsResult = {
  rows: AnalyticsRow[];
  totals: { pageviews: number; visitors: number };
};

export async function getVisits(): Promise<AnalyticsResult> {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    throw new Error("Faltan VERCEL_TOKEN o VERCEL_PROJECT_ID en las variables de entorno.");
  }

  const until = new Date();
  const since = new Date(until);
  since.setDate(since.getDate() - 29);

  const params = new URLSearchParams({
    projectId,
    since: since.toISOString().slice(0, 10),
    until: until.toISOString().slice(0, 10),
    by: "day",
  });

  if (process.env.VERCEL_TEAM_ID) params.set("teamId", process.env.VERCEL_TEAM_ID);

  const headers = { Authorization: `Bearer ${token}` };
  const [aggregateResponse, countResponse] = await Promise.all([
    fetch(`https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${params}`, { headers, cache: "no-store" }),
    fetch(`https://api.vercel.com/v1/query/web-analytics/visits/count?${params}`, { headers, cache: "no-store" }),
  ]);

  if (!aggregateResponse.ok || !countResponse.ok) throw new Error("Vercel no pudo devolver las métricas de Analytics.");

  const [aggregate, count] = await Promise.all([
    aggregateResponse.json() as Promise<{ data?: AnalyticsRow[] }>,
    countResponse.json() as Promise<{ data?: { pageviews?: number; visitors?: number } }>,
  ]);

  return {
    rows: aggregate.data ?? [],
    totals: {
      pageviews: count.data?.pageviews ?? 0,
      visitors: count.data?.visitors ?? 0,
    },
  };
}
