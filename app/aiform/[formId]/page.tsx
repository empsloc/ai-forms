"use client";
import FormUI from "@/app/edit-form/_components/FormUI";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
interface Params {
  formId: number;
}
function LiveAiForm({ params }: { params: Promise<Params> }) {
  const { formId } = use(params);
  const [record, setRecord] = useState<any>();
  const [jsonForm, setJsonForm] = useState<any>([]);
  useEffect(() => {
    formId && GetFormData();
  }, [params]);
  const GetFormData = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.id, Number(formId)));
    setRecord(result[0]);
    setJsonForm(JSON.parse(result[0].jsonform));
    console.log(result);
  };
  return (
    <div
      className="p-10 flex justify-center items-center"
      style={{
        backgroundImage: record?.background,
      }}
    >
      {record && (
        <FormUI
          jsonForm={jsonForm}
          onFieldUpdate={() => console.log()}
          deleteField={() => console.log()}
          selectedTheme={record?.theme}
          editable={false}
          formId={record.id}
          enableSignIn={record.enableSignIn}
        />
      )}
      <Link
        href={process.env.NEXT_PUBLIC_BASE_URL!}
        className="flex gap-2 items-center bg-black text-white px-3 py-1 rounded-full fixed bottm-5 left-5 cursor-pointer"
      >
        <Image src={"/logo.svg"} width={26} height={26} alt="" />
        Build Your Own AI forms
      </Link>
    </div>
  );
}

export default LiveAiForm;
