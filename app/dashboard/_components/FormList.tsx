"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";

function FormList() {
  const { user } = useUser();
  const [FormList, setFormList] = useState<any>([]);
  useEffect(() => {
    user && GetFormList();
  }, [user]);
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
  };
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-5">
      {FormList.map((form: any, index: any) => (
        <div key={index}>
          <FormListItem
            JsonForm={JSON.parse(form.jsonform)}
            formRecord={form}
            refreshData={GetFormList}
          />{" "}
        </div>
      ))}
    </div>
  );
}

export default FormList;
