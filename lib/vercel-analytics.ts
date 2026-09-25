type AnalyticsRow = {
  timestamp: string;
  pageviews: number;
  visitors: number;
};

export async function getVisits(): Promise<AnalyticsRow[]> {
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

  const response = await fetch(
    `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${params}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );

  if (!response.ok) throw new Error("Vercel no pudo devolver las métricas de Analytics.");

  const data = (await response.json()) as { data?: AnalyticsRow[] };
  return data.data ?? [];
}
