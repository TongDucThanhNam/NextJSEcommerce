"use client";

// app/admin/layout.tsx
import React from "react";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>{/* Sidebar content here */}</aside>
      <main>{children}</main>
    </div>
  );
}
