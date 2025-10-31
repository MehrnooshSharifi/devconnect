"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const cache = createCache({ key: "mui", prepend: true });
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
