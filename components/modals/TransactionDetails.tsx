"use client";

import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/common";
import dayjs from "dayjs";

interface TransactionDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const TransactionDetails = ({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailsProps) => {
  if (!transaction) return null;

  // Derive status safely for UI mapping.
  // The UI calls for a "Success" flag.
  const isSuccess = true; // Placeholder since no explicit status is in model.
  const tData = transaction.data;

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
                Transaction Details
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#4E7397] leading-none">
                View details of transaction entry
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
            ID: TX{transaction.id || "6255533"}
          </h2>

          <div className="bg-[#f1f1f1] rounded-[12px] p-3 flex justify-between items-center mb-6">
            <span className="text-[#4E7397] text-[15px]">
              Transaction Status
            </span>
            <span
              className={`px-5 py-2.5 rounded-full text-[13px] font-semibold shadow-sm ${
                isSuccess
                  ? "bg-[#dcfce7] text-[#166534]"
                  : "bg-[#fee2e2] text-[#991b1b]"
              }`}
            >
              {isSuccess ? "Success" : "Failed"}
            </span>
          </div>

          <div className="bg-[#f1f1f1] rounded-[12px] p-5 space-y-1 mb-10">
            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Timestamp</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {tData?.activationDate
                  ? dayjs(tData.activationDate).format("DD/MM/YYYY • hh:mma")
                  : "10/11/2025 • 10:30am"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">
                Transaction Type
              </span>
              <span className="text-[#111827] text-[14px] text-right font-medium whitespace-break-spaces text-balance max-w-[65%]">
                {tData?.transactionType || "Jaiz to Other Banks Transfers"}
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
                {tData?.loginName}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">Customer Email</span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                admin@apexgrid.com
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">
                Beneficiary Account
              </span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {tData?.beneficiaryAccount || transaction.creditAccount}
              </span>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-[#4E7397] text-[13px]">
                Beneficiary Bank
              </span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                {tData?.beneficiaryBank}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 pt-6 mb-2">
              <span className="text-[#4E7397] text-[13px]">
                Beneficiary Name
              </span>
              <span className="text-[#111827] text-[14px] text-right font-medium">
                Jamin Saliba-Audu
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                className="rounded-full px-10 h-12 bg-[#EEF2F6] text-[#0F2851] hover:bg-[#E2E8F0] shadow-none font-medium text-[15px]"
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

export default TransactionDetails;
