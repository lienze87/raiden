import * as React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <nav>
          <Link href={"/"}>Home</Link> | <Link href={"/admin"}>Admin</Link>
        </nav>
      </header>
    </>
  );
}
