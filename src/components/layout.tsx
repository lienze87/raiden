import * as React from "react";
import Head from "next/head";
import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>{"MyNote"}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <main id="app">{children}</main>
    </>
  );
}
