import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import TextArea from "./form/input/TextArea";
import Button from "./ui/button/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AssignedUser {
  name: string;
  avatar: string;
}

interface TaskAccordionProps {
  title: string;
  assignedUsers: AssignedUser[];
  startDate: string;
  dueDate: string;
  status: string;
  priority: string;
  initialDetails?: string;
  onSubmitTask: (details: string) => void;
}

const TaskAccordion: React.FC<TaskAccordionProps> = ({
  title,
  assignedUsers,
  startDate,
  dueDate,
  status,
  priority,
  initialDetails = "",
  onSubmitTask,
}) => {

  const formik = useFormik({
    initialValues: {
      task_details: initialDetails,
    },
    validationSchema: Yup.object({
      task_details: Yup.string().required("Task Details is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmitTask(values.task_details);
      resetForm();
    },
  });

  return (
    <div className="bg-white mb-2 rounded-md shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3">
        <p className="text-base font-semibold mb-1">{title}</p>
        <div className="flex items-center gap-1">
          <span className="text-[14px] text-[#616161] font-medium mr-1">
            Assigned to:
          </span>
          <AvatarGroup max={2}>
            {assignedUsers.map((user:any, index:any) => (
              <Avatar key={index} alt={user.name} src={user.avatar} />
            ))}
          </AvatarGroup>
        </div>
      </div>

      <div className="px-4">
        <form onSubmit={formik.handleSubmit}>
          <Accordion
            disableGutters
            square
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              margin: 0,
              "&:before": { display: "none" },
              "&.Mui-expanded": { margin: 0 },
            }}
          >
            <AccordionSummary
              expandIcon={<IoIosArrowDown />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                paddingX: 0,
                paddingY: 0,
                minHeight: "auto",
                "&.Mui-expanded": {
                  minHeight: "auto",
                },
              }}
            >
              <div className="flex gap-4 flex-wrap">
                <span className="text-sm text-[#616161]">
                  Start Date:{startDate}
                </span>
                <span className="text-sm text-[#616161]">
                  Due Date:{dueDate}
                </span>
                <span className="flex items-center gap-1 text-sm text-[#616161]">
                  Status:
                  <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
                    {status}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-sm text-[#616161]">
                  Priority:
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span> {priority}
                  </span>
                </span>
              </div>
            </AccordionSummary>

            <AccordionDetails sx={{ paddingX: 0 }}>
              <TextArea
                placeholder="Enter your task_details"
                rows={2}
                value={formik.values.task_details}
                onChange={(value) =>
                  formik.setFieldValue("task_details", value)
                }
                onBlur={() =>
                  formik.setFieldTouched("task_details", true)
                }
                error={
                  formik.touched.task_details &&
                  Boolean(formik.errors.task_details)
                }
                hint={
                  formik.touched.task_details
                    ? formik.errors.task_details
                    : ""
                }
                disabled={formik.isSubmitting}
              />
              <div className="flex items-end justify-end">
                <Button type="submit">Update Task</Button>
              </div>
            </AccordionDetails>
          </Accordion>
        </form>
      </div>
    </div>
  );
};

export default TaskAccordion;
