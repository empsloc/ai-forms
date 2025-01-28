"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";

import { LibraryBig, LineChart, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "My Forms",
      icon: LibraryBig,
      path: "/dashboard",
    },
    {
      id: 1,
      name: "Responses",
      icon: MessageSquare,
      path: "/dashboard/responses",
    },
    {
      id: 1,
      name: "Analytics",
      icon: LineChart,
      path: "/dashboard/analytics",
    },
    {
      id: 1,
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
  ];
  const path = usePathname();
  const {user} = useUser()
  const [formList, setFormList] = useState<any>()
  const [percentageFileCreated, setPercentageFileCreated] = useState<any>(0)
  const GetFormList = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      console.error("User email is undefined.");
      return [];
    }
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, email))
      .orderBy(desc(JsonForms.id));

    setFormList(result);
    console.log(result);

    const perc = (result.length/50)*100
    setPercentageFileCreated(perc)
  };
  useEffect(() => {
    user&&GetFormList()
  }, [user]);
  return (
    <div className="h-screen shadow-md border flex flex-col py-10 justify-between">
      <div className="p-5">
        {menuList.map((menu, index) => (
          <Link
            href={menu.path}
            key={index}
            className={`${path == menu.path && "bg-purple-600 text-white"} flex items-center gap-3 p-4  hover:bg-purple-600  hover:text-white rounded-lg mb-3 cursor-pointer`}
          >
            <menu.icon />
            {menu.name}
          </Link>
        ))}
      </div>
      <div className=" mb-40 p-6 ">
        <Button className="w-full">+ Create form</Button>
        <div className="my-5">
          <Progress value={percentageFileCreated} />
          <h2 className="text-sm mt-2 text-gray-500">
            <strong>{formList?.length}</strong> out of <strong>50</strong> file created
          </h2>
          <h2 className="text-sm mt-3 text-gray-500">
            Upgrade your plan for unlimited access
          </h2>
        </div>
      </div>
    </div>
  );
}

export default SideNav;

