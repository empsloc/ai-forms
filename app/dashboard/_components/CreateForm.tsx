"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIChatSession } from "@/configs/AIModal";
import { useUser } from "@clerk/nextjs";
import { JsonForms } from "@/configs/schema";
import { db } from "@/configs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
const PROMPT =
  " on the basis of description please give form in json format with form title, form subheading with form having form field, form name, placeholder , and form label, fieldType, field required in Json Format, give output as an object inside {} eg do not include field type of  number, file only include textarea, select, checkbox, text, email, tel,";
function filterJSONBlock(input: string) {
  // Match and extract the content inside the curly braces
  const match = input.match(/{[\s\S]*}/);
  return match ? match[0] : null; // Return the matched content or null if no match
}
function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>();
  const { user } = useUser();
  const route = useRouter()
  const onCreateForm = async () => {
    console.log(userInput);
    setLoading(true);
    const result = await AIChatSession.sendMessage(
      "Description : " + userInput + PROMPT
    );
    console.log(result.response.text());
    if (result.response.text()) {
      const resp = await db
        .insert(JsonForms)
        .values({
          jsonform: filterJSONBlock(result.response.text()) || "",
          createdBy: user?.primaryEmailAddress?.emailAddress || "",
          createdDate: moment().format("DD/MM/YYYY"),
        })
        .returning({ id: JsonForms.id });
      console.log("New form ID", resp[0].id);
      if(resp[0].id){
        route.push("/edit-form/"+resp[0].id)
      }
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <div>
      <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="my-2"
                placeholder="Write the description for yout form"
                onChange={(event) => setUserInput(event.target.value)}
              />
              <div className="flex gap-2 my-3 justify-end">
                <Button
                  onClick={() => setOpenDialog(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
                <Button disabled={loading} onClick={() => onCreateForm()}>

                  {loading?<Loader2 className="animate-spin"/>:"Create"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;
