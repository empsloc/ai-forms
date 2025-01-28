import { Delete, Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog"


function FieldEdit({defaultValue, onUpdate, deleteField}:any) {
    const [label,setLabel] = useState<any>(defaultValue?.formLabel)
    const [placeholder, setPlaceholder] = useState<any>(defaultValue.placeholder)
    return (
    <div className="mt-6 flex gap-2">
      
      <Popover>
        <PopoverTrigger><Edit className="h-5 w-5 text-gray-500" /></PopoverTrigger>
        <PopoverContent>
            <h2>
                Edit Fields 
                <div>
                    <label className="text-xs">Label Name</label>
                    <Input type="text" defaultValue={defaultValue.formLabel} onChange={(e)=>setLabel(e.target.value)}/>
                </div>
                <div>
                    <label className="text-xs">Placeholder Name</label>
                    <Input type="text" defaultValue={defaultValue.placeholder} onChange={(e)=>setPlaceholder(e.target.value)}/>
                </div>
                <Button className="mt-3" size="sm" onClick={()=>onUpdate({
                    label:label,
                    placeholder:placeholder
                })}>Update</Button>
            </h2>
        </PopoverContent>
      </Popover>
      
      <AlertDialog>
  <AlertDialogTrigger>
  <Trash className="h-5 w-5 text-red-500" />
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>deleteField()}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>
  );
}

export default FieldEdit;
