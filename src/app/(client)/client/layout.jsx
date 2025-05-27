"use client";
import React from "react";
import Menu from "./_components/menu";




export default function Layout({ children }) {
  return (
    <div className="relative overflow-x-hidden">
      {/* Home Section */}
      <section className="w-full">
        <Menu />
        {children}
      </section>
    </div>
  );
}
