"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import FormUI from "../_components/FormUI";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Copy } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface Params {
  formId: number;
}

async function fetchParams(paramsPromise: Promise<Params>) {
  return await paramsPromise;
}

function EditForm({ params }: { params: Promise<Params> }) {
  const { user } = useUser();
  const { formId } = use(params);
  const [jsonForm, setJsonForm] = useState<any>([]);
  const [updateTrigger, setUpdateTrigger] = useState<any>();
  const [record, setRecord] = useState<any>([]);
  const [selectedTheme, setSelectedTheme] = useState<any>("light");
  const [selectedBackground, setSelectedBackground] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    user && GetFormData();
  }, [user]);

  const GetFormData = async () => {
    const emailAddress = user?.primaryEmailAddress?.emailAddress;
    if (!emailAddress) {
      console.error("User email address is undefined.");
      return;
    }

    const result = await db
      .select()
      .from(JsonForms)
      .where(
        and(eq(JsonForms.id, formId), eq(JsonForms.createdBy, emailAddress)),
      );
    console.log(JSON.parse(result[0].jsonform));
    setJsonForm(JSON.parse(result[0].jsonform));
    setRecord(result[0]);
    setSelectedBackground(result[0].background);
  };
  useEffect(() => {
    if (updateTrigger) {
      setJsonForm(jsonForm);
      updateJsonFormInDB();
    }
  }, [updateTrigger]);
  const onFieldUpdate = (value: any, index: any) => {
    jsonForm.formFields[index].formLabel = value.label;
    jsonForm.formFields[index].placeholder = value.placeholder;
    // console.log(jsonForm);
    setUpdateTrigger(Date.now());
  };
  const updateJsonFormInDB = async () => {
    const emailAddress = user?.primaryEmailAddress?.emailAddress;
    if (!emailAddress) {
      console.error("User email address is undefined.");
      return;
    }
    const result = await db
      .update(JsonForms)
      .set({ jsonform: jsonForm })
      .where(
        and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, emailAddress)),
      );

    console.log(result);
    toast("Updated");
  };
  const deleteField = (indexToDelete: any) => {
    const result = jsonForm.formFields.filter(
      (item: any, index: any) => index != indexToDelete,
    );
    // console.log(result)
    jsonForm.formFields = result;
    setUpdateTrigger(Date.now());
  };
  const updateControllerFields = async (value: any, columnName: any) => {
    const emailAddress = user?.primaryEmailAddress?.emailAddress;
    if (!emailAddress) {
      console.error("User email address is undefined.");
      return;
    }
    const result = await db
      .update(JsonForms)
      .set({
        [columnName]: value,
      })
      .where(
        and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, emailAddress)),
      );

    toast("Updated");
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h2
          className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Back
        </h2>
        <div className="flex gap-2">
          <Link href={"/aiform/" + record?.id} target="_blank">
            {" "}
            <Button className="flex gap-2">
              <SquareArrowOutUpRight />
              Live preview
            </Button>
          </Link>

          <div className="flex gap-2  ">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Share2 className="h-5 w-5" /> Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    {jsonForm.formSubheading}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      defaultValue={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        "/aiform/" +
                        record?.id
                      }
                      readOnly
                    />
                  </div>
                  <Button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(
                          process.env.NEXT_PUBLIC_BASE_URL +
                            "/aiform/" +
                            record?.id,
                        )
                        .then(() => {
                          alert("Link copied to clipboard!");
                        })
                    }
                    type="submit"
                    size="sm"
                    className="px-3"
                  >
                    <span className="sr-only">Copy</span>
                    <Copy />
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            selectedTheme={(value: any) => {
              updateControllerFields(value, "theme");
              setSelectedTheme(value);
            }}
            selectedBackground={(value: any) => {
              updateControllerFields(value, "background");
              setSelectedBackground(value);
            }}
            setSignInEnable = {(value:any)=>{
              updateControllerFields(value, "enableSignIn");
            }}
          />
        </div>
        <div
          className="md:col-span-2 border rounded-lg p-5 flex  justify-center  "
          style={{ backgroundImage: selectedBackground }}
        >
          <FormUI
            selectedTheme={selectedTheme}
            onFieldUpdate={onFieldUpdate}
            jsonForm={jsonForm}
            deleteField={(index: any) => deleteField(index)}
            editable={true}
            formId={jsonForm.id}
            enableSignIn={record.enableSignIn}
            
          />
        </div>
      </div>
    </div>
  );
}

export default EditForm;
