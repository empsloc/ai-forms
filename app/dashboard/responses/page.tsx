"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItemResp from "./_components/FormListItemResp";

function Responses() {
  const { user } = useUser();
  const [formList, setFormList] = useState<any>();
  useEffect(() => {
    user && getFormList();
  }, [user]);
  const getFormList = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.log("Email cannot be fethced");
      return [];
    }
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, email));

    console.log(result);
    setFormList(result);
  };
  return (
    <div className="p-10">
      <h2 className="flex justify-between font-bold text-3xl">
        Responses
      </h2>
      {formList&&<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {formList.map((form:any,index:any)=>(
          <div className="my-5" key={index}>
          <FormListItemResp
          formRecord = { form }
          jsonForm = { JSON.parse(form.jsonform)}
          />
          </div>
        ))}
      </div>}
    </div>
  );
}

export default Responses;
