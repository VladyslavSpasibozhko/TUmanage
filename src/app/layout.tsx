import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "App",
  description: "App",
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
