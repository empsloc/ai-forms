import React from "react";
import type { Metadata } from "next";
import { SignedIn, SignIn } from "@clerk/nextjs";
import SideNav from "./_components/SideNav";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SignedIn>
        <div className="hidden md:block md:w-64 fixed">
          <SideNav />
        </div>
        <div className="md:ml-64">{children}</div>
      </SignedIn>
    </div>
  );
}

export default DashboardLayout;

