import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import SuccessModal from "./Success";
import { AxiosResponse } from "axios";

export interface CreateNewBroadcastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProceed?: () => Promise<void | AxiosResponse> | void;
  onSuccess?: () => void;
  title: string;
  description: string;
  successTitle: string;
  successDescription: string;
}

const ConfirmModal = ({
  open,
  onOpenChange,
  onProceed,
  onSuccess,
  title,
  description,
  successTitle,
  successDescription,
}: CreateNewBroadcastProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleProceed = async () => {
    if (onProceed) {
      setIsProcessing(true);
      try {
        await onProceed();
        onOpenChange?.(false);
        setShowSuccess(true);
        onSuccess?.();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md overflow-hidden bg-white gap-0 rounded-3xl max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle className="text-[22px] font-semibold text-[#0B1527] mb-2 leading-none">
          {title}
        </DialogTitle>
        <DialogDescription className="text-[14px] text-[#4E7397] leading-none">
          {description}
        </DialogDescription>
        <div className="flex items-center justify-end mt-6 gap-4">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button
            isLoading={isProcessing}
            onClick={() => {
              handleProceed();
            }}
          >
            Proceed
          </Button>
        </div>
      </DialogContent>

      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title={successTitle}
        description={successDescription}
      />
    </Dialog>
  );
};

export default ConfirmModal;
