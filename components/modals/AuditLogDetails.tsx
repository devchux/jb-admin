import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuditLog } from "@/types/common";
import dayjs from "dayjs";

interface AuditLogDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditLog: AuditLog | null;
}

const AuditLogDetails = ({
  open,
  onOpenChange,
  auditLog,
}: AuditLogDetailsProps) => {
  if (!auditLog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[560px] p-0 overflow-hidden bg-white gap-0 rounded-[28px] max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8 pb-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <DialogTitle className="text-[22px] font-semibold text-[#0B1527] mb-2 leading-none">
                Audit Log Details
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#4E7397] leading-none">
                View details of log entry
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="h-11 w-11 rounded-[14px] bg-[#EEF2F6] text-[#0F2851] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors shrink-0">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </DialogClose>
          </div>

          <div className="h-px bg-[#EEF2F6] mb-4" />

          <h2 className="text-[18px] font-bold text-[#111827] mb-6">
            ID:{auditLog.id}
          </h2>

          <div className="bg-[#f1f1f1] rounded-[12px] p-3 flex justify-between items-center mb-6">
            <span className="text-[#4E7397] text-[15px]">Flag Status</span>
            <span className="bg-white px-5 py-2.5 rounded-full text-[13px] font-semibold text-[#111827] shadow-sm">
              N/A
            </span>
          </div>

          <div className="bg-[#f1f1f1] rounded-[12px] p-3 space-y-1 mb-8">
            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Log Timestamp</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {dayjs(auditLog.timestamp).format("DD/MM/YYYY • hh:mma")}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">IP ddress</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {auditLog.ipAddress || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">User Name</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {auditLog.userId || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">User Email</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {auditLog.email || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Action</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {auditLog.action || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">
                Issue Description
              </span>
              <span className="text-[#111827] text-[14px] text-right font-medium leading-relaxed max-w-[65%]">
                {auditLog.requestPayload || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 pt-6">
              <span className="text-[#4E7397] text-[13px]">Role</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                N/A
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-12">
            <Checkbox
              id="flag-activity"
              className="rounded-[6px] bg-white data-[state=checked]:bg-[#193F7F] data-[state=checked]:border-[#193F7F] border-[#C3D0DF] h-[22px] w-[22px]"
            />
            <Label
              htmlFor="flag-activity"
              className="text-[15px] text-[#111827] font-medium cursor-pointer leading-none"
            >
              Flag Activity
            </Label>
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                className="rounded-full px-10 h-12 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-medium text-[15px]"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditLogDetails;
