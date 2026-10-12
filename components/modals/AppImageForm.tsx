"use client";

import { ChangeEvent, FormEvent, useEffect, useId, useState } from "react";
import { AxiosError } from "axios";
import { ImagePlus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { appImageService } from "@/services/app-image";
import { AppImage, AppImageCategory } from "@/types/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const categories = Object.values(AppImageCategory);

type AppImageFormProps = {
  image?: AppImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ error?: string }>;
  return axiosError.response?.data?.error || fallback;
};

export default function AppImageForm({
  image,
  open,
  onOpenChange,
  onSuccess,
}: AppImageFormProps) {
  const fileId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [category, setCategory] = useState<string>(AppImageCategory.WELCOME);
  const [title, setTitle] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setFile(null);
    setPreviewUrl("");
    setCategory(image?.category || AppImageCategory.WELCOME);
    setTitle(image?.title || "");
    setDisplayOrder(String(image?.displayOrder ?? 0));
    setActive(image?.active ?? true);
    setErrors({});
  }, [image, open]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null;
    if (selected && !selected.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, file: "Choose an image file" }));
      return;
    }
    setFile(selected);
    setErrors((current) => ({ ...current, file: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!image && !file) nextErrors.file = "Choose an image to upload";
    if (!category) nextErrors.category = "Choose a category";
    if (!/^\d+$/.test(displayOrder)) {
      nextErrors.displayOrder = "Enter zero or a positive whole number";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("category", category);
    formData.append("title", title.trim());
    formData.append("displayOrder", displayOrder);
    if (image) formData.append("active", String(active));

    try {
      setSubmitting(true);
      if (image) await appImageService.update(image.id, formData);
      else await appImageService.upload(formData);
      toast.success(image ? "App image updated" : "App image uploaded");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          image
            ? "Unable to update image. Try again."
            : "Unable to upload image. Try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-y-auto gap-0 border-0 bg-white p-0 sm:max-w-[620px] sm:rounded-[28px]"
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-start justify-between gap-6 px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
            <div>
              <DialogTitle className="text-[22px] leading-tight text-[#151B28]">
                {image ? "Edit app image" : "Upload app image"}
              </DialogTitle>
              <DialogDescription className="mt-2 leading-5 text-[#4E7397]">
                {image
                  ? "Update how this image appears in the mobile app."
                  : "Add an image for a mobile app placement."}
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close"
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8EDF5] text-[#193F7F] transition-colors hover:bg-[#DDE5F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#193F7F]"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </DialogClose>
          </div>

          <div className="space-y-5 px-6 pb-8 sm:px-8">
            <div>
              <Label htmlFor={fileId}>Image{image ? "" : " *"}</Label>
              <label
                htmlFor={fileId}
                className="mt-2 flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#B9C7D8] bg-[#F8FAFC] p-4 text-center transition-colors hover:border-[#193F7F] focus-within:ring-2 focus-within:ring-[#193F7F] focus-within:ring-offset-2"
              >
                <input
                  id={fileId}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="sr-only"
                  aria-invalid={Boolean(errors.file)}
                  aria-describedby={errors.file ? `${fileId}-error` : undefined}
                />
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Selected image preview"
                    className="max-h-48 w-full rounded-xl object-contain"
                  />
                ) : (
                  <>
                    <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#E8EDF5] text-[#193F7F]">
                      <ImagePlus className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-[#193F7F]">
                      Choose an image
                    </span>
                    <span className="mt-1 text-xs text-[#66788A]">
                      PNG, JPG, WEBP, or GIF
                    </span>
                    {image && (
                      <span className="mt-2 text-xs text-[#66788A]">
                        Leave unchanged to keep the current file
                      </span>
                    )}
                  </>
                )}
              </label>
              {errors.file && (
                <p
                  id={`${fileId}-error`}
                  role="alert"
                  className="mt-2 text-xs text-red-600"
                >
                  {errors.file}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="app-image-category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    id="app-image-category"
                    className="mt-2 !h-12 w-full rounded-xl"
                  >
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="app-image-order">Display order *</Label>
                <Input
                  id="app-image-order"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={displayOrder}
                  onChange={(event) => setDisplayOrder(event.target.value)}
                  aria-invalid={Boolean(errors.displayOrder)}
                  aria-describedby={
                    errors.displayOrder ? "app-image-order-error" : undefined
                  }
                  className="mt-2 h-12 rounded-xl"
                />
                {errors.displayOrder && (
                  <p
                    id="app-image-order-error"
                    role="alert"
                    className="mt-2 text-xs text-red-600"
                  >
                    {errors.displayOrder}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="app-image-title">Title</Label>
              <Input
                id="app-image-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Welcome offer"
                className="mt-2 h-12 rounded-xl"
              />
            </div>

            {image && (
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F4F7FA] p-4">
                <div>
                  <Label htmlFor="app-image-active">Active</Label>
                  <p className="mt-1 text-xs leading-5 text-[#66788A]">
                    Show this image in the mobile app.
                  </p>
                </div>
                <Switch
                  id="app-image-active"
                  checked={active}
                  onCheckedChange={setActive}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#E8EDF2] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-full px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              className="h-11 rounded-full bg-[#193F7F] px-6 text-white hover:bg-[#123466]"
            >
              <Upload className="size-4" aria-hidden="true" />
              {image ? "Save changes" : "Upload image"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
