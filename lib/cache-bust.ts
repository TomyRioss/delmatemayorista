export function withCacheBust(src: string) {
  const sha = process.env.NEXT_PUBLIC_GIT_SHA;
  return sha ? `${src}?v=${sha}` : src;
}
