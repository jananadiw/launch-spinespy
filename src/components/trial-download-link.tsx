import { Download } from "lucide-react";
import {
  TRIAL_BUILD_DOWNLOAD_URL,
  isTrialDownloadLive,
} from "@/lib/site";

interface TrialDownloadLinkProps {
  className?: string;
  showIcon?: boolean;
}

export function TrialDownloadLink({
  className = "btn-primary",
  showIcon = true,
}: TrialDownloadLinkProps) {
  if (!isTrialDownloadLive()) {
    return (
      <span
        className={`${className} inline-flex items-center gap-2 opacity-70 cursor-not-allowed`}
        title="Trial build URL is not configured yet"
      >
        {showIcon && <Download className="w-5 h-5" aria-hidden="true" />}
        Download for macOS (coming soon)
      </span>
    );
  }

  return (
    <a
      href={TRIAL_BUILD_DOWNLOAD_URL}
      download
      className={`${className} inline-flex items-center gap-2`}
    >
      {showIcon && <Download className="w-5 h-5" aria-hidden="true" />}
      Download for macOS
    </a>
  );
}
