import { AxiosResponse } from "axios";
import { apiService } from "./api";
import { AppImage } from "@/types/common";

export class AppImageService {
  getById(id: string): Promise<AxiosResponse<AppImage>> {
    return apiService.get("base", `/api/admin/app-images/${id}`);
  }

  upload(file: FormData): Promise<AxiosResponse<AppImage>> {
    return apiService.postBlob("base", `/api/admin/app-images`, file);
  }

  update(id: string, file: FormData): Promise<AxiosResponse<AppImage>> {
    return apiService.putBlob("base", `/api/admin/app-images/${id}`, file);
  }

  delete(id: string): Promise<AxiosResponse<void>> {
    return apiService.delete("base", `/api/admin/app-images/${id}`);
  }

  getContent(id: string): Promise<AxiosResponse<Blob>> {
    return apiService.getBlob("base", `/api/admin/app-images/${id}/content`);
  }
}
