"use client";

import React, { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import SuccessModal from "@/components/modals/Success";
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
  isEmail: z.boolean(),
  isInApp: z.boolean(),
  isScheduled: z.boolean(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
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
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: "",
      message: "",
      isEmail: true,
      isInApp: false,
      isScheduled: true,
      scheduledDate: "",
      scheduledTime: "",
    },
  });

  const isScheduled = form.watch("isScheduled");

  const onSubmit = async (data: BroadcastFormValues) => {
    try {
      setLoading(true);

      // Combine date and time to ISO if needed
      let scheduledAt = new Date().toISOString();
      if (data.isScheduled && data.scheduledDate && data.scheduledTime) {
        scheduledAt = new Date(
          `${data.scheduledDate}T${data.scheduledTime}`,
        ).toISOString();
      }

      await notificationService.createBroadcast({
        title: data.title,
        message: data.message,
        scheduledAt,
        createdBy: user.id,
        type: "BROADCAST",
        targetGroups: [],
        targetUsers: [],
        targetUserId: "",
      });
      setShowSuccess(true);
      form.reset();
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to create broadcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[560px] p-0 overflow-hidden bg-white gap-0 rounded-[28px] max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <DialogTitle className="text-[22px] font-semibold text-[#0B1527] mb-2 leading-none">
                Send New Broadcast
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#4E7397] leading-none">
                Fill details to send broadcast message
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="h-11 w-11 rounded-[14px] bg-[#EEF2F6] text-[#0F2851] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors shrink-0">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </DialogClose>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#9CA3AF] font-medium text-[13px] block mb-2">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Product Launch Announcement"
                        className="h-12 rounded-[8px] border-[#E2E8F0] text-[#1A202C] px-4 text-[15px] font-normal placeholder:text-[#1A202C]/50 focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
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
                    <FormLabel className="text-[#9CA3AF] font-medium text-[13px] block mb-2">
                      Message Body
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Hello team, we're excited to announce our new product launch!&#10;&#10;This marks an important step forward for us as we continue to improve what we offer..."
                        className="min-h-[140px] rounded-[8px] resize-none border-[#E2E8F0] text-[#1A202C] px-4 py-3 text-[15px] leading-relaxed font-normal placeholder:text-[#1A202C]/50 focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="h-px bg-[#F3F4F6] my-6" />

              <div className="space-y-6">
                <div>
                  <label className="text-[#9CA3AF] font-medium text-[13px] block mb-4">
                    Broadcast Channel
                  </label>
                  <div className="flex items-center gap-8">
                    <FormField
                      control={form.control}
                      name="isEmail"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="rounded-[6px] data-[state=checked]:bg-[#193F7F] data-[state=checked]:border-[#193F7F] border-[#C3D0DF] h-5 w-5"
                            />
                          </FormControl>
                          <FormLabel className="text-[15px] font-medium text-[#111827] cursor-pointer">
                            Email
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isInApp"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="rounded-[6px] data-[state=checked]:bg-[#193F7F] data-[state=checked]:border-[#193F7F] border-[#C3D0DF] h-5 w-5"
                            />
                          </FormControl>
                          <FormLabel className="text-[15px] font-medium text-[#111827] cursor-pointer">
                            In-app
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#9CA3AF] font-medium text-[13px] block mb-4">
                    Broadcast Channel
                  </label>
                  <FormField
                    control={form.control}
                    name="isScheduled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 mb-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded-[6px] data-[state=checked]:bg-[#193F7F] data-[state=checked]:border-[#193F7F] border-[#C3D0DF] h-5 w-5"
                          />
                        </FormControl>
                        <FormLabel className="text-[15px] font-medium text-[#111827] cursor-pointer">
                          Schedule Send
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  {isScheduled && (
                    <div className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#4E7397]" />
                                <Input
                                  type="date"
                                  className="h-12 pl-12 rounded-[8px] border-[#E2E8F0] text-[#1A202C] text-[15px] block"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduledTime"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#4E7397]" />
                                <Input
                                  type="time"
                                  className="h-12 pl-12 rounded-[8px] border-[#E2E8F0] text-[#1A202C] text-[15px] block"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full px-8 h-12 bg-[#EEF2F6] text-[#0F2851] hover:bg-[#E2E8F0] shadow-none font-medium text-[15px]"
                >
                  Save Draft
                </Button>
                <Button
                  isLoading={loading}
                  type="submit"
                  className="rounded-full px-8 h-12 bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-medium text-[15px]"
                >
                  Send Broadcast
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>

      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Broadcast Message sent successfully"
        description="All recipients have been notified. Please report any issues if something was missed."
        onDone={() => {
          setShowSuccess(false);
          onOpenChange?.(false);
          onSuccess?.();
        }}
      />
    </Dialog>
  );
};

export default CreateNewBroadcast;
