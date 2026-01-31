import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "authentication",
  description: "Track Attend Authentication verification",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
