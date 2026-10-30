import { createConnection } from "node:net";

export async function isPocketBaseReachable(url: string): Promise<boolean> {
  const target = new URL(url);
  const port = Number(target.port || (target.protocol === "https:" ? 443 : 80));

  return new Promise((resolve) => {
    const socket = createConnection({ host: target.hostname, port });
    const finish = (reachable: boolean) => {
      socket.destroy();
      resolve(reachable);
    };

    socket.setTimeout(500, () => finish(false));
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
  });
}
