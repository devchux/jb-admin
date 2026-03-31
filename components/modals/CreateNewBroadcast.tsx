"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, Calendar, Clock, ChevronDown, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDebounce } from "react-use";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { userService } from "@/services/user";
import { User } from "@/types/common";
import { cn } from "@/lib/utils";

const broadcastSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    targetUsers: z.array(z.string()).min(1, "Select at least one audience"),
    isEmail: z.boolean(),
    isInApp: z.boolean(),
    isScheduled: z.boolean(),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isScheduled) {
      return;
    }

    if (!data.scheduledDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledDate"],
        message: "Scheduled date is required",
      });
    }

    if (!data.scheduledTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledTime"],
        message: "Scheduled time is required",
      });
    }

    if (!data.scheduledDate || !data.scheduledTime) {
      return;
    }

    const scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`);

    if (Number.isNaN(scheduledAt.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledDate"],
        message: "Enter a valid schedule date and time",
      });
      return;
    }

    if (scheduledAt <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledDate"],
        message: "Schedule must be set to a future date and time",
      });
    }
  });

type BroadcastFormValues = z.infer<typeof broadcastSchema>;

interface CreateNewBroadcastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateNewBroadcast = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateNewBroadcastProps) => {
  const user = useStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [usersById, setUsersById] = useState<Record<string, User>>({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [audienceSearch, setAudienceSearch] = useState("");
  const [debouncedAudienceSearch, setDebouncedAudienceSearch] = useState("");
  const [dateInputType, setDateInputType] = useState<"text" | "date">("text");
  const [timeInputType, setTimeInputType] = useState<"text" | "time">("text");

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: "",
      message: "",
      targetUsers: [],
      isEmail: true,
      isInApp: false,
      isScheduled: true,
      scheduledDate: "",
      scheduledTime: "",
    },
  });

  const isScheduled = form.watch("isScheduled");
  const selectedAudienceIds = form.watch("targetUsers");
  const scheduledDate = form.watch("scheduledDate");
  const scheduledTime = form.watch("scheduledTime");

  useDebounce(
    () => {
      setDebouncedAudienceSearch(audienceSearch.trim());
    },
    400,
    [audienceSearch],
  );

  const selectedAudience = useMemo(
    () =>
      selectedAudienceIds
        .map((id) => usersById[id])
        .filter((item): item is User => Boolean(item)),
    [selectedAudienceIds, usersById],
  );

  useEffect(() => {
    if (!open || !audienceOpen) {
      return;
    }

    const getUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await userService.getAllUsers({
          page: 0,
          size: 5,
          ...debouncedAudienceSearch && { search: debouncedAudienceSearch },
        });

        setSearchResults(response.data.content);
        setUsersById((current) => {
          const next = { ...current };

          response.data.content.forEach((item) => {
            next[item.userId] = item;
          });

          return next;
        });
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    getUsers();
  }, [open, audienceOpen, debouncedAudienceSearch]);

  useEffect(() => {
    setDateInputType(scheduledDate ? "date" : "text");
  }, [scheduledDate]);

  useEffect(() => {
    setTimeInputType(scheduledTime ? "time" : "text");
  }, [scheduledTime]);

  const toggleAudience = (userId: string) => {
    const current = form.getValues("targetUsers");
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];

    form.setValue("targetUsers", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onBroadcast = async (data: BroadcastFormValues, isDraft: boolean) => {
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
        targetUsers: data.targetUsers,
        targetUserId: "",
        draft: isDraft,
      });
      setShowSuccess(true);
      form.reset();
      setAudienceOpen(false);
      setAudienceSearch("");
      setDebouncedAudienceSearch("");
      setSearchResults([]);
      setDateInputType("text");
      setTimeInputType("text");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to create broadcast");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: BroadcastFormValues) => onBroadcast(data, false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[652px] p-0 overflow-hidden bg-white gap-0 rounded-[28px] max-h-[90vh] overflow-y-auto border-0"
      >
        <div className="px-8 py-9">
          <div className="flex items-start justify-between mb-10">
            <div>
              <DialogTitle className="text-[22px] font-semibold text-[#151B28] mb-2 leading-none tracking-[-0.02em]">
                Send New Broadcast
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#4E7397] leading-none">
                Fill details to send broadcast message
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="h-14 w-14 rounded-[16px] bg-[#E8EDF5] text-[#193F7F] flex items-center justify-center hover:bg-[#DDE5F0] transition-colors shrink-0">
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </DialogClose>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#94A3B8] font-medium text-[13px] block mb-2">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Product Launch Announcement"
                        className="h-[52px] rounded-[10px] border-[#DCE5F0] text-[#2A3140] px-4 text-[15px] font-normal placeholder:text-[#2A3140] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
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
                    <FormLabel className="text-[#94A3B8] font-medium text-[13px] block mb-2">
                      Message Body
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Hello team, we're excited to announce our new product launch!&#10;&#10;This marks an important step forward for us as we continue to improve what we offer..."
                        className="min-h-[146px] rounded-[10px] resize-none border-[#DCE5F0] text-[#2A3140] px-4 py-4 text-[15px] leading-[1.55] font-normal placeholder:text-[#2A3140] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetUsers"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-[#94A3B8] font-medium text-[13px] block mb-2">
                      Broadcast Audience
                    </FormLabel>
                    <Popover open={audienceOpen} onOpenChange={setAudienceOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <button
                            type="button"
                            className={cn(
                              "flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[10px] border border-[#DCE5F0] bg-white px-4 py-3 text-left transition-colors",
                              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]",
                            )}
                          >
                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                              {selectedAudience.length > 0 ? (
                                selectedAudience.map((item) => (
                                  <span
                                    key={item.userId}
                                    className="inline-flex max-w-full items-center rounded-full bg-[#EEF3FB] px-3 py-1 text-[13px] font-medium text-[#193F7F]"
                                  >
                                    <span className="truncate">
                                      {item.firstName} {item.lastName}
                                    </span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[15px] text-[#94A3B8]">
                                  Select Audience
                                </span>
                              )}
                            </div>
                            <ChevronDown className="h-5 w-5 shrink-0 text-[#111827]" />
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        sideOffset={8}
                        className="w-[var(--radix-popover-trigger-width)] rounded-[14px] border-[#DCE5F0] p-0 shadow-[0_20px_45px_rgba(15,40,81,0.12)]"
                      >
                        <Command className="rounded-[14px]">
                          <CommandInput
                            placeholder="Search users"
                            value={audienceSearch}
                            onValueChange={setAudienceSearch}
                            className="text-[14px] text-[#2A3140] placeholder:text-[#94A3B8]"
                          />
                          <CommandList className="max-h-[240px]">
                            <CommandEmpty className="py-5 text-[14px] text-[#94A3B8] px-3">
                              {loadingUsers
                                ? "Loading users..."
                                : "No users found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {searchResults.map((item) => {
                                const fullName = `${item.firstName} ${item.lastName}`;
                                const selected = selectedAudienceIds.includes(
                                  item.userId,
                                );

                                return (
                                  <CommandItem
                                    key={item.userId}
                                    value={`${fullName} ${item.email}`}
                                    onSelect={() => toggleAudience(item.userId)}
                                    className="flex items-center justify-between rounded-[10px] px-3 py-3 text-[14px] text-[#2A3140] aria-selected:bg-[#F6F9FC]"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate font-medium">
                                        {fullName}
                                      </p>
                                      <p className="truncate text-[12px] text-[#94A3B8]">
                                        {item.email}
                                      </p>
                                    </div>
                                    <span
                                      className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded-[6px] border",
                                        selected
                                          ? "border-[#193F7F] bg-[#193F7F] text-white"
                                          : "border-[#C9D5E2] bg-white text-transparent",
                                      )}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </span>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="h-px bg-[#E9EEF5]" />

              <div className="space-y-6">
                {/* <div>
                  <label className="text-[#94A3B8] font-medium text-[13px] block mb-4">
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
                          <FormLabel className="text-[15px] font-medium text-[#2A3140] cursor-pointer">
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
                          <FormLabel className="text-[15px] font-medium text-[#2A3140] cursor-pointer">
                            In-app
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div> */}

                <div>
                  <label className="text-[#94A3B8] font-medium text-[13px] block mb-4">
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
                        <FormLabel className="text-[15px] font-medium text-[#2A3140] cursor-pointer">
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
                                  {...field}
                                  type={dateInputType}
                                  placeholder="Select Date"
                                  onFocus={() => setDateInputType("date")}
                                  onBlur={() =>
                                    setDateInputType(
                                      field.value ? "date" : "text",
                                    )
                                  }
                                  className="h-14 pl-12 rounded-[10px] border-[#DCE5F0] text-[#2A3140] text-[15px] block placeholder:text-[#2A3140] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
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
                                  {...field}
                                  type={timeInputType}
                                  placeholder="Select Time"
                                  onFocus={() => setTimeInputType("time")}
                                  onBlur={() =>
                                    setTimeInputType(
                                      field.value ? "time" : "text",
                                    )
                                  }
                                  className="h-14 pl-12 rounded-[10px] border-[#DCE5F0] text-[#2A3140] text-[15px] block placeholder:text-[#2A3140] focus-visible:ring-1 focus-visible:ring-[#193F7F] focus-visible:border-[#193F7F]"
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

              <div className="mt-10 flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full px-8 h-10 min-w-[136px] bg-[#E7EDF6] text-[#1F2937] hover:bg-[#DDE5F0] shadow-none font-medium text-[15px]"
                  onClick={() => onBroadcast(form.getValues(), true)}
                >
                  Save Draft
                </Button>
                <Button
                  isLoading={loading}
                  type="submit"
                  className="rounded-full px-8 h-10 min-w-[170px] bg-[#193F7F] text-white hover:bg-[#132A55] shadow-none font-medium text-[15px]"
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
