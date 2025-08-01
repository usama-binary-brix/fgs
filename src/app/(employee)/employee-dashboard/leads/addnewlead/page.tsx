"use client";

import { LeadForm } from '@/components/forms/LeadForm';
import { useAddLeadMutation } from "@/store/services/api";

const AddNewLead = () => {
  const [addLead] = useAddLeadMutation();

  const handleSubmit = async (values: any) => {
    return await addLead(values).unwrap();
  };

  return (
    <LeadForm
      onSubmit={handleSubmit}
      role="employee"
      redirectPath="/employee-dashboard/leads"
    />
  );
};

export default AddNewLead;