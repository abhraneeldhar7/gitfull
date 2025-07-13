import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function timeAgo(isoDate: string): string {
  const now = new Date();
  const past = new Date(isoDate);
  const diff = (now.getTime() - past.getTime()) / 1000; // in seconds

  if (diff < 60) return `${Math.floor(diff)} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 172800) return `yesterday`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}


export function removeCSSFilesTree(tree: any) {
  return tree.filter((item: any) => !(item.type === "blob" && item.path.endsWith(".css")));
}
export function filterOnlyFilesTree(tree: any) {
  return tree.filter((item: any) => item.type === "blob");
}
export function removeMediaFilesTree(tree: { path: string }[]): typeof tree {
  const mediaExtensions = [
    ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp",
    ".bmp", ".ico", ".tiff", ".avif", ".heic", // images
    ".mp4", ".webm", ".mov", ".avi", ".mkv", ".flv", ".wmv", // videos
    ".mp3", ".wav", ".ogg", ".aac", ".m4a", // audio
    '.pdf', '.zip', '.tar', '.gz'
  ];

  return tree.filter(({ path }) => {
    const lowerPath = path.toLowerCase();
    return !mediaExtensions.some(ext => lowerPath.endsWith(ext));
  });
}