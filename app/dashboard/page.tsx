import { Button } from "@/components/ui/button";
import React from "react";
import CreateForm from "./_components/CreateForm";
import FormList from "./_components/FormList";

function Dashboard() {
  return (
    <div className="p-10">
      <h2 className="flex justify-between font-bold text-3xl">
        Dashboard
        <CreateForm />
      </h2>
      {/* List of forms */}

      <FormList />
    </div>
  );
}

export default Dashboard;
