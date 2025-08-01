"use client";

import { LeadForm } from '@/components/forms/LeadForm';
import { useAddLeadMutation } from "@/store/services/api";

const AdminAddNewLead = () => {
  const [addLead] = useAddLeadMutation();

  const handleSubmit = async (values: any) => {
    return await addLead(values).unwrap();
  };

  return (
    <LeadForm
      onSubmit={handleSubmit}
      role="admin"
      redirectPath="/dashboard/leads"
    />
  );
};

export default AdminAddNewLead;