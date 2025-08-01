'use client'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useEditLeadMutation, useGetLeadByIdQuery, usePromoteToInvestorMutation } from '@/store/services/api';
import { toast } from 'react-toastify';
import { LeadForm } from '@/components/forms/LeadForm';

type ErrorResponse = {
  data: {
    error: Record<string, string>;
  };
};

const ViewDetailsLeads = () => {
  const { id } = useParams();
  const { data: leadData, error, isLoading } = useGetLeadByIdQuery(id);
  const [editLead] = useEditLeadMutation();
  const [promoteInvestor, { isLoading: isPromoteLoading }] = usePromoteToInvestorMutation();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    return await editLead({ id, ...values }).unwrap();
  };

  const handlePromoteToInvestor = async (leadId: string) => {
    try {
      const response = await promoteInvestor({
        lead_id: leadId,
        type: "promote_to_investor",
      }).unwrap();

      toast.success("Investor promoted successfully!");
    } catch (error) {
      const err = error as { data?: { error?: string } };
      toast.error(err.data?.error || "Email is Already Promoted");
    }
  };

  const handleSuccess = (response: any) => {
    toast.success(response.message || 'Lead updated successfully');
  };

  const handleError = (error: any) => {
    const errorResponse = error as ErrorResponse;
    if (errorResponse?.data?.error) {
      Object.values(errorResponse.data.error).forEach((errorMessage) => {
        toast.error(errorMessage);
      });
    } else {
      toast.error("Failed to update lead.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading lead</div>;
  }

  // Transform the lead data to match the form structure
  const initialData = leadData?.lead ? {
    lead_type: leadData.lead.lead_type || "",
    name: leadData.lead.name || "",
    title: leadData.lead.title || "",
    company: leadData.lead.company || "",
    phone: leadData.lead.phone || "",
    email: leadData.lead.email || "",
    street_address: leadData.lead.street_address || "",
    city: leadData.lead.city || "",
    state: leadData.lead.state || "",
    zip_code: leadData.lead.zip_code || "",
    number_of_calls: leadData.lead.number_of_calls || "",
    lead_source: leadData.lead.lead_source || "",
    reminder: leadData.lead.reminder || "",
    reminder_date_time: leadData.lead.reminder_date_time ? new Date(leadData.lead.reminder_date_time) : null,
    reminder_time: null,
    hot_lead: leadData.lead.hot_lead,
    in_finance: leadData.lead.in_finance,
    sourcing: leadData.lead.sourcing,
    lift_type: leadData.lead.lift_type || "",
    engine_type: leadData.lead.engine_type || "",
    location_used: leadData.lead.location_used || "",
    max_capacity: leadData.lead.max_capacity || "",
    condition: leadData.lead.condition || "",
    budget_min: leadData.lead.budget_min || "",
    budget_max: leadData.lead.budget_max || "",
    financing: leadData.lead.financing || "",
    purchase_timeline: leadData.lead.purchase_timeline || "",
    quick_comment: leadData.lead.quick_comment || "",
    comments: leadData.lead.comments || "",
    lead_created_by: leadData.lead.lead_created_by || "",
  } : null;

  return (
    <LeadForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      onError={handleError}
      role="salesperson"
      redirectPath="/sales-dashboard/leads"
      onPromoteToInvestor={handlePromoteToInvestor}
      leadId={id as string}
      isPromoteLoading={isPromoteLoading}
      canPromote={leadData?.lead?.lead_type !== 'customer' && leadData?.lead?.type === 'lead'}
    />
  );
};

export default ViewDetailsLeads;
