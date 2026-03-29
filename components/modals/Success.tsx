import React from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onDone?: () => void;
}

const SuccessModal = ({
  open,
  onOpenChange,
  title,
  description,
  onDone,
}: SuccessModalProps) => {
  const handleDone = () => {
    onOpenChange(false);
    if (onDone) onDone();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[480px] p-0 overflow-hidden bg-white gap-0 rounded-[28px]"
      >
        <div className="p-10 flex flex-col items-center justify-center text-center">
          <div className="my-[40px] flex items-center justify-center">
            <div className="w-20 h-20 rotate-45 border-[1.5px] border-[#193F7F] rounded-[20px] flex items-center justify-center relative">
              <div className="-rotate-45 absolute w-8 h-8 bg-[#16A34A] rounded-full flex items-center justify-center text-white">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
            </div>
          </div>

          <h2 className="text-[22px] font-semibold text-[#111827] mb-3 leading-tight mt-6">
            {title}
          </h2>
          <p className="text-[14px] text-[#4E7397] leading-relaxed max-w-[90%] mb-10">
            {description}
          </p>

          <Button
            type="button"
            onClick={handleDone}
            className="rounded-full px-12 h-12 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-semibold text-[15px]"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
