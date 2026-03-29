"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Notification } from "@/types/common";
import dayjs from "dayjs";

interface BroadcastDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  broadcast: Notification | null;
}

const BroadcastDetails = ({
  open,
  onOpenChange,
  broadcast,
}: BroadcastDetailsProps) => {
  const [isScheduled, setIsScheduled] = useState(false);

  // Check if broadcast is sent, to determine status
  const isSent = broadcast?.sent;

  if (!broadcast) return null;

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
                Broadcast Details
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#4E7397] leading-none">
                View details of Broadcast
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="h-11 w-11 rounded-[14px] bg-[#EEF2F6] text-[#0F2851] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors shrink-0">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </DialogClose>
          </div>

          <div className="h-px bg-[#EEF2F6] mb-8" />

          <div className="bg-[#f1f1f1] rounded-[12px] p-5 space-y-1 mb-4">
            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Broadcast ID</span>
              <span className="text-[#111827] text-[14px] text-right font-semibold">
                TX{broadcast.id || "6255533"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Sent At</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {broadcast.sentAt || broadcast.createdAt
                  ? dayjs(broadcast.sentAt || broadcast.createdAt).format(
                      "DD/MM/YYYY • hh:mma"
                    )
                  : "10/11/2025 • 10:30am"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Channel</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                Email
              </span>
            </div>
          </div>

          <div className="bg-[#f1f1f1] rounded-[12px] p-3 flex justify-between items-center mb-4 px-5">
            <span className="text-[#4E7397] text-[14px]">Message Status</span>
            <span
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium shadow-sm ${
                isSent
                  ? "bg-[#dcfce7] text-[#166534]"
                  : "bg-[#E2E8F0] text-[#475569]"
              }`}
            >
              {isSent ? "Sent" : "Draft"}
            </span>
          </div>

          <div className="bg-[#f1f1f1] rounded-[12px] p-5 mb-8">
            <h4 className="text-[#4E7397] text-[14px] mb-3">Message</h4>
            <div className="text-[#111827] text-[14px] font-medium leading-relaxed whitespace-pre-wrap">
              {broadcast.message ||
                "Hello team, we're excited to announce our new product launch!\n\nThis marks an important step forward for us as we continue to improve what we offer..."}
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-10 pt-2">
            <Checkbox
              id="schedule-broadcast"
              checked={isScheduled}
              onCheckedChange={(checked) => setIsScheduled(!!checked)}
              className="rounded-[6px] bg-white data-[state=checked]:bg-[#193F7F] data-[state=checked]:border-[#193F7F] border-[#C3D0DF] h-[22px] w-[22px]"
            />
            <Label
              htmlFor="schedule-broadcast"
              className="text-[15px] text-[#111827] font-medium cursor-pointer leading-none"
            >
              Schedule Broadcast
            </Label>
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                className="rounded-full px-8 h-12 bg-[#EEF2F6] text-[#0F2851] hover:bg-[#E2E8F0] shadow-none font-semibold text-[15px]"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="rounded-full px-8 h-12 bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-none font-semibold text-[15px]"
            >
              Delete
            </Button>
            <Button
              type="button"
              className="rounded-full px-10 h-12 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-semibold text-[15px]"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastDetails;
