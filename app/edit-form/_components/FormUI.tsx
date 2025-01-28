"use client"
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldEdit from "./FieldEdit";
import { userResponses } from "@/configs/schema";
import { db } from "@/configs";
import { toast } from "sonner";
import moment from "moment";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface FormUIProps {
  jsonForm: any;
  onFieldUpdate: any;
  deleteField: any;
  selectedTheme: any;
  editable: any;
  formId:any;
  enableSignIn:any;
}
function FormUI({
  jsonForm,
  onFieldUpdate,
  deleteField,
  selectedTheme,
  editable = true,
  formId= 0,
  enableSignIn= false
}: FormUIProps) {
  const [formData, setFormData] = useState<any>();
  let formRef = useRef<HTMLFormElement | null>(null);
  const {user, isSignedIn} = useUser()

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSelectChange = (name: any, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(name, value);
  };
  const onFormSubmit = async (event: any) => {
    event.preventDefault(); 
    console.log(formData);
    const result = await db.insert(userResponses).values({
      jsonResponse: formData,
      createdAt: moment().format("DD/MM/yyyy"),
      formRef: formId
    });

    if (result) {
      if (formRef.current) {
        formRef.current.reset();
      }
      toast("Respone submitted successfully");
    } else {
      toast("Error while saving your form");
    }
  };

  const handleCheckboxChange = (fielName: any, itemName: any, value: any) => {
    const list = formData?.[fielName] ? formData?.[fielName] : [];
    if (value) {
      list.push({
        label: itemName,
        value: value,
      });
      setFormData({
        ...formData,
        [fielName]: list,
      });
    } else {
      const result = list.filter((item: any) => item.label == itemName);
      setFormData({
        ...formData,
        [fielName]: result,
      });
    }
    console.log(formData);
  };
  return (
    <form
      ref={formRef}
      onSubmit={onFormSubmit}
      className="border p-5 md:w-[600px] rounded-lg "
      data-theme={selectedTheme}
    >
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-500 text-center">
        {jsonForm?.formSubheading}
      </h2>
      {jsonForm.formFields?.map((field: any, index: any) => (
        <div key={index} className="flex items-center gap-2">
          {field?.fieldType == "select" ? (
            <div className="my-3 ">
              <label className="text-sm text-gray-600">
                {field?.formLabel}
              </label>
              <Select
                required={field.fieldRequired}
                onValueChange={(v) => handleSelectChange(field.formName, v)}
              >
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder={field?.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field?.options.map((item: any, index: any) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field?.fieldType == "radio" ? (
            <div className="w-full my-3">
              <label className="text-sm text-gray-600">
                {field?.formLabel}
              </label>
              <RadioGroup required={field.fieldRequired}>
                {field.options.map((item: any, index: any) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={item.label}
                      id={item.label}
                      onClick={() =>
                        handleSelectChange(field.formName, item.label)
                      }
                    />
                    <Label htmlFor={item.label}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.fieldType == "checkbox" ? (
            <div className="my-3 w-full">
              <label className="text-sm text-gray-600">{field.formLabel}</label>
              <div className="">
                {field?.options ? (
                  field?.options?.map((item: any, index: any) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Checkbox
                        onCheckedChange={(v) =>
                          handleCheckboxChange(field.formName, item.label, v)
                        }
                      />

                      <h2>{item.label}</h2>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-2 items-center w-full">
                    <Checkbox required={field.fieldRequired} />
                    <h2>{field.label}</h2>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-sm text-gray-600">
                {field?.formLabel}
              </label>

              <Input
                type={field?.fieldType}
                placeholder={field?.placeholder}
                name={field?.formName}
                className="bg-transparent"
                required={field.fieldRequired}
                onChange={(e: any) => handleInputChange(e)}
              />
            </div>
          )}

          {editable && (
            <div>
              <FieldEdit
                defaultValue={field}
                onUpdate={(value: any) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
              />
            </div>
          )}
        </div>
      ))}
      {!enableSignIn?<button type="submit" className="btn btn-primary rounded-full">
        Submit
      </button>:
      isSignedIn?<button type="submit" className="btn btn-primary rounded-full">
        Submit
      </button>:<Button>
        <SignInButton>Sign in before submitting</SignInButton>
        </Button>}
      
    </form>
  );
}

export default FormUI;
