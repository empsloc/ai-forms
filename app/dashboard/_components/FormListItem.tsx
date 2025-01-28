import { Button } from "@/components/ui/button";
import { Copy, Edit, Share, Trash } from "lucide-react";
import React from "react";

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
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";

function FormListItem({ JsonForm, formRecord, refreshData }: any) {
  const { user } = useUser();
  const onDeleteForm = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.log("Cannot get user");
      return [];
    }
    const result = await db
      .delete(JsonForms)
      .where(
        and(eq(JsonForms.id, formRecord.id), eq(JsonForms.createdBy, email))
      );

      if(result){
        toast("Form deleted")
        refreshData()
      }
  };
  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex justify-between">
        <h2></h2>
        <AlertDialog>
          <AlertDialogTrigger>
            {" "}
            <Trash className="h-5 w-5 text-red-600 hover:scale-105 transition-all cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteForm()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h2 className=" text-lg  text-black">{JsonForm?.formTitle}</h2>
      <h2 className=" text-sm text-gray-500">{JsonForm?.formSubheading}</h2>
      <hr className="my-4"></hr>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share className="h-5 w-5" /> Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>{JsonForm.formSubheading}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue={process.env.NEXT_PUBLIC_BASE_URL + "/aiform/"+formRecord.id}
                    readOnly
                  />
                </div>
                <Button onClick={()=>navigator.clipboard
      .writeText(process.env.NEXT_PUBLIC_BASE_URL + "/aiform/"+formRecord.id)
      .then(() => {
        alert("Link copied to clipboard!");
      })} type="submit" size="sm" className="px-3">
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
        <Link href={"/edit-form/" + formRecord?.id}>
          <Button className="flex gap-2">
            <Edit className="h-5 w-5" /> Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default FormListItem;
