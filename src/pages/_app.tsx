import * as React from "react";
import type { AppProps } from "next/app";

import Layout from "../components/layout/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
