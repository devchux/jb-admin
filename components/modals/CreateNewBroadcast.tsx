"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { notificationService } from "@/services/notification";
import { useStore } from "@/store";
import { toast } from "sonner";
import { AxiosError } from "axios";

const broadcastSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  scheduledAt: z.string().min(1, "Scheduled At is required"),
});

type BroadcastFormValues = z.infer<typeof broadcastSchema>;

interface CreateNewBroadcastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateNewBroadcast = ({
  open = true,
  onOpenChange,
  onSuccess,
}: CreateNewBroadcastProps) => {
  const user = useStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: "",
      message: "",
      scheduledAt: new Date().toLocaleString(),
    },
  });

  const onSubmit = async (data: BroadcastFormValues) => {
    try {
      setLoading(true);
      await notificationService.createBroadcast({
        ...data,
        createdBy: user.id,
      });
      onOpenChange?.(false);
      onSuccess?.();
      form.reset();
      toast.success("Broadcast created successfully");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data.error || "Failed to create broadcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-125 p-0 overflow-hidden bg-white gap-0 rounded-3xl"
      >
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <DialogTitle className="text-2xl font-semibold text-[#0B1527]">
                Create New Broadcast
              </DialogTitle>
              <DialogDescription className="text-sm text-[#4E7397]">
                Fill details to create a new broadcast.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="h-11 w-11 rounded-2xl bg-[#EEF2F6] text-[#0F2851] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors shrink-0">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </DialogClose>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4E7397] font-medium text-sm block">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        className="h-11.5 rounded-xl border-[#E2E8F0] text-[#1A202C] px-4 text-[15px] font-normal placeholder:text-[#1A202C]/50 focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4E7397] font-medium text-sm block">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter message"
                        className="min-h-30 rounded-xl border-[#E2E8F0] text-[#1A202C] px-4 py-3 text-[15px] font-normal placeholder:text-[#1A202C]/50 focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4E7397] font-medium text-sm block">
                      Scheduled At
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="h-11.5 rounded-xl border-[#E2E8F0] text-[#1A202C] px-4 text-[15px] font-normal focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F] block"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-10 flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full px-8 py-5.5 bg-[#EEF2F6] text-[#0A1629] hover:bg-[#E2E8F0] shadow-none font-medium text-[15px]"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  isLoading={loading}
                  type="submit"
                  className="rounded-full px-8 py-5.5 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-medium text-[15px]"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewBroadcast;
