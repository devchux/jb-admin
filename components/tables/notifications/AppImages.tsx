"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { ImageIcon, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import AppImageForm from "@/components/modals/AppImageForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TableActionPopover } from "@/components/ui/table-action-popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appImageService } from "@/services/app-image";
import { AppImage, AppImageCategory } from "@/types/common";
import { usePermissions } from "@/hooks/use-permissions";

type StatusFilter = "all" | "true" | "false";

const fileSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const errorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ error?: string }>;
  return axiosError.response?.data?.error || fallback;
};

export default function AppImages() {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const [images, setImages] = useState<AppImage[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<AppImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionOpen, setActionOpen] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await appImageService.getAll({
        ...(category !== "all" && { category: category as AppImage["category"] }),
        ...(status !== "all" && { active: status }),
      });
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      setImages([]);
      toast.error(errorMessage(error, "Unable to load app images. Try again."));
    } finally {
      setLoading(false);
    }
  }, [category, status]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    let cancelled = false;
    const createdUrls: string[] = [];

    const loadPreviews = async () => {
      const entries = await Promise.all(
        images.map(async (image) => {
          try {
            const response = await appImageService.getContent(image.id);
            const url = URL.createObjectURL(response.data);
            createdUrls.push(url);
            return [image.id, url] as const;
          } catch {
            return null;
          }
        }),
      );
      if (!cancelled) setPreviewUrls(Object.fromEntries(entries.filter(Boolean) as [string, string][]));
    };

    setPreviewUrls({});
    if (images.length) loadPreviews();
    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const filteredImages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...images]
      .filter((image) => !normalizedQuery || image.title?.toLowerCase().includes(normalizedQuery) || image.fileName?.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [images, query]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await appImageService.delete(deleteTarget.id);
      toast.success("App image deleted");
      setDeleteTarget(null);
      loadImages();
    } catch (error) {
      toast.error(errorMessage(error, "Unable to delete image. Try again."));
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (image: AppImage) => {
    setSelected(image);
    setFormOpen(true);
  };

  return (
    <section aria-labelledby="app-images-heading" className="min-h-[32rem] w-full">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <span className="mr-3 h-8 w-3 rounded-full bg-[#193F7F]" aria-hidden="true" />
          <div>
            <h1 id="app-images-heading" className="text-xl font-semibold text-gray-900">App images</h1>
            <p className="mt-1 text-sm text-[#66788A]">Manage imagery displayed in the mobile app.</p>
          </div>
        </div>
        {hasPermission("image:create") && <Button onClick={openCreate} className="h-11 rounded-full bg-[#193F7F] px-5 text-white hover:bg-[#123466]">
          <Plus className="size-4" aria-hidden="true" />Upload image
        </Button>}
      </div>

      <div className="my-8 grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_180px]">
        <div className="relative">
          <label htmlFor="app-image-search" className="sr-only">Search app images</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#7890A8]" aria-hidden="true" />
          <Input id="app-image-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or file name" className="h-12 rounded-full border-[#DDE3EA] pl-11" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Filter by category" className="h-12 w-full rounded-full border-[#DDE3EA] px-4"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.values(AppImageCategory).map((item) => <SelectItem key={item} value={item}>{item.replaceAll("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
          <SelectTrigger aria-label="Filter by status" className="h-12 w-full rounded-full border-[#DDE3EA] px-4"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="true">Active</SelectItem><SelectItem value="false">Inactive</SelectItem></SelectContent>
        </Select>
      </div>

      <div aria-live="polite" className="sr-only">{loading ? "Loading app images" : `${filteredImages.length} app images shown`}</div>

      <div className="overflow-x-auto">
        <Table className="min-w-[920px]">
          <TableHeader className="bg-[#F7F8FA]">
            <TableRow className="border-b border-[#EEEEEE] hover:bg-transparent">
              <TableHead className="h-12 px-5 text-xs font-medium text-[#7A8998]">Image</TableHead>
              <TableHead className="h-12 px-5 text-xs font-medium text-[#7A8998]">Title</TableHead>
              <TableHead className="h-12 px-5 text-xs font-medium text-[#7A8998]">Category</TableHead>
              <TableHead className="h-12 px-5 text-xs font-medium text-[#7A8998]">Display order</TableHead>
              <TableHead className="h-12 px-5 text-xs font-medium text-[#7A8998]">File details</TableHead>
              <TableHead className="h-12 px-5 text-xs font-medium text-[#7A8998]">Status</TableHead>
              <TableHead className="h-12 px-5 text-xs font-medium text-[#7A8998]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && [0, 1, 2].map((item) => (
              <TableRow key={item}>
                <TableCell colSpan={7} className="h-20 px-5">
                  <div className="h-5 animate-pulse rounded bg-[#EEF2F6] motion-reduce:animate-none" />
                </TableCell>
              </TableRow>
            ))}

            {!loading && filteredImages.map((image) => (
              <TableRow key={image.id} className="border-b border-[#EEF1F4] hover:bg-[#FAFBFC]">
                <TableCell className="px-5 py-3">
                  <div className="flex h-14 w-24 items-center justify-center overflow-hidden rounded-lg bg-[#F3F6F9]">
                    {previewUrls[image.id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrls[image.id]} alt="" className="h-full w-full object-cover outline -outline-offset-1 outline-black/10" />
                    ) : <ImageIcon className="size-6 text-[#9BAFC2]" aria-hidden="true" />}
                  </div>
                </TableCell>
                <TableCell className="max-w-60 px-5 py-3">
                  <p className="font-medium text-[#151B28]">{image.title || "Untitled image"}</p>
                  <p className="mt-1 truncate text-xs text-[#7A8998]" title={image.fileName}>{image.fileName || "No file name"}</p>
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-[#263648]">{image.category.replaceAll("_", " ")}</TableCell>
                <TableCell className="px-5 py-3 text-sm tabular-nums text-[#263648]">{image.displayOrder}</TableCell>
                <TableCell className="px-5 py-3">
                  <p className="text-sm text-[#263648]">{fileSize(image.fileSize)}</p>
                  <p className="mt-1 text-xs text-[#7A8998]">{image.contentType || "Unknown type"}</p>
                </TableCell>
                <TableCell className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${image.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    <span className={`size-1.5 rounded-full ${image.active ? "bg-emerald-500" : "bg-slate-400"}`} aria-hidden="true" />
                    {image.active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-3">
                  {hasAnyPermission(["image:update", "image:delete"]) && <TableActionPopover open={actionOpen === image.id} onOpenChange={(open) => setActionOpen(open ? image.id : null)}>
                    {hasPermission("image:update") && <button type="button" onClick={() => { setActionOpen(null); openEdit(image); }} className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#193F7F]">Edit image</button>}
                    {hasPermission("image:delete") && <button type="button" onClick={() => { setActionOpen(null); setDeleteTarget(image); }} className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-600">Delete image</button>}
                  </TableActionPopover>}
                </TableCell>
              </TableRow>
            ))}

            {!loading && !filteredImages.length && (
              <TableRow className="hover:bg-white">
                <TableCell colSpan={7} className="h-72 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center px-6">
                    <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#E8EDF5] text-[#193F7F]"><ImageIcon className="size-6" aria-hidden="true" /></span>
                    <h2 className="font-semibold text-[#151B28]">{query || category !== "all" || status !== "all" ? "No matching images" : "No app images yet"}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#66788A]">{query || category !== "all" || status !== "all" ? "Adjust your search or filters to see other images." : "Upload an image to start managing mobile app placements."}</p>
                    {!query && category === "all" && status === "all" && hasPermission("image:create") && <Button onClick={openCreate} className="mt-5 rounded-full bg-[#193F7F] text-white hover:bg-[#123466]">Upload image</Button>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasAnyPermission(["image:create", "image:update"]) && <AppImageForm image={selected} open={formOpen} onOpenChange={setFormOpen} onSuccess={loadImages} />}

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete app image?</DialogTitle>
          <DialogDescription>This permanently removes “{deleteTarget?.title || deleteTarget?.fileName || "this image"}”. This action cannot be undone.</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" isLoading={deleting} onClick={handleDelete}>Delete image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
