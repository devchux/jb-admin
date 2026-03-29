import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/40 z-9999 h-dvh">
      <Loader2 size={40} color="#D4AF37" className="animate-spin" />
    </div>
  );
}
