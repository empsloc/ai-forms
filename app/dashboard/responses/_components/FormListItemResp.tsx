"use client"
import { Button } from "@/components/ui/button";
import { db } from "@/configs";
import { userResponses } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import * as XLSX from "xlsx"

function FormListItemResp({ jsonForm, formRecord }: any) {
  const [loading, setLoading] = useState<any>(false)
  const ExportData=async()=>{
    let jsonData:any = [];
    setLoading(true)
    const result = await db.select().from(userResponses).where(eq(userResponses.formRef,formRecord.id))

    console.log(result)
    if(result){
      result.forEach((item:any)=>{
        const jsonItem = JSON.parse(item.jsonResponse);
        jsonData.push(jsonItem)

      })
      setLoading(false)
    }
    console.log(jsonData)
    exportToExcel(jsonData)
  }

  const exportToExcel=(jsonData:any)=>{
    const worksheet = XLSX.utils.json_to_sheet(jsonData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, jsonForm?.formTitle+".xlsx")
  }
  return (
    <div className="border shadow-sm rounded-lg p-4">
      <h2 className=" text-lg  text-black">{jsonForm?.formTitle}</h2>
      <h2 className=" text-sm text-gray-500">{jsonForm?.formSubheading}</h2>
      <hr className="my-4"></hr>
      <div className="flex  justify-between items-center">
        <h2 className="text-sm"><strong>45</strong> Responses</h2>
        <Button className="" disabled={loading} size='sm' onClick={()=>ExportData()}>{loading?<Loader2 className="animate-spin"/>:"Export"}</Button>
      </div>
    </div>
  );
}

export default FormListItemResp;
