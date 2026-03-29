"use client";

import React, { useState, useEffect } from "react";
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
import { SupportTicket } from "@/types/common";
import dayjs from "dayjs";

interface SupportTicketDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
}

const SupportTicketDetails = ({
  open,
  onOpenChange,
  ticket,
}: SupportTicketDetailsProps) => {
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    if (ticket) {
      setIsResolved(ticket.status === "RESOLVED");
    }
  }, [ticket]);

  if (!ticket) return null;

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
                Support Ticket Details
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#4E7397] leading-none">
                View details of complaints log entry
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
            ID: TX{ticket.id}
          </h2>

          <div className="bg-[#f1f1f1] rounded-[12px] p-3 flex justify-between items-center mb-6">
            <span className="text-[#4E7397] text-[15px]">Support Status</span>
            <span
              className={`px-5 py-2.5 rounded-full text-[13px] font-semibold shadow-sm ${
                isResolved
                  ? "bg-[#dcfce7] text-[#166534]"
                  : "bg-[#E2E8F0] text-[#475569]"
              }`}
            >
              {isResolved ? "Resolved" : "Pending"}
            </span>
          </div>

          <div className="bg-[#f1f1f1] rounded-[12px] p-5 space-y-1 mb-8">
            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Log Timestamp</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {dayjs(ticket.createdAt).format("DD/MM/YYYY • hh:mma")}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Log Channel</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                Email
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Customer Name</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {ticket.userId || "ApexGrid Services"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Customer Email</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {ticket.email || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Issue Category</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {ticket.subject || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">
                Issue Description
              </span>
              <span className="text-[#111827] text-[14px] text-right font-medium leading-relaxed max-w-[65%]">
                {ticket.message || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 pt-6">
              <span className="text-[#4E7397] text-[13px]">Initiator</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {ticket.assignedTo || "Jamin Saliba-Audu"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-12">
            <Checkbox
              id="mark-resolved"
              checked={isResolved}
              onCheckedChange={(checked) => setIsResolved(!!checked)}
              className="rounded-[6px] bg-white data-[state=checked]:bg-[#193F7F] data-[state=checked]:border-[#193F7F] border-[#C3D0DF] h-[22px] w-[22px]"
            />
            <Label
              htmlFor="mark-resolved"
              className="text-[15px] text-[#111827] font-medium cursor-pointer leading-none"
            >
              Mark as resolved
            </Label>
          </div>

          <div className="flex justify-end gap-3">
            {isResolved ? (
              <DialogClose asChild>
                <Button
                  type="button"
                  className="rounded-full px-10 h-12 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-medium text-[15px]"
                >
                  Close
                </Button>
              </DialogClose>
            ) : (
              <>
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="rounded-full px-8 h-12 bg-[#EEF2F6] text-[#0F2851] hover:bg-[#E2E8F0] shadow-none font-medium text-[15px]"
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  className="rounded-full px-6 h-12 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-medium text-[15px]"
                >
                  Send Follow up Mail
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketDetails;
