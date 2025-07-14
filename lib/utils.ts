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
    ".pdf", ".zip", ".tar", ".gz"
  ];

  return tree.filter(({ path }) => {
    const lowerPath = path.toLowerCase();

    const isMedia = mediaExtensions.some(ext => lowerPath.endsWith(ext));
    const isEnvFile = lowerPath.endsWith(".env") || lowerPath.includes(".env.");
    const isReadme = lowerPath.endsWith("readme.md");
    const isNodeModule = lowerPath.startsWith("node_modules/");
    const isShadcn = lowerPath.includes("components/ui/");
    const isMagicUI = lowerPath.includes("components/magicui/");


    return !isMedia && !isEnvFile && !isReadme && !isNodeModule && !isShadcn && !isMagicUI;
  });
}



export function insertOrReplaceTopImage(readmeText: string, imageUrl: string): string {
  const lines = readmeText.split('\n');

  // Remove existing image lines (basic markdown image detection)
  const filteredLines = lines.filter(line => !line.trim().match(/^!\[.*?\]\(.*?\)/));

  // Find top-level heading
  const headingIndex = filteredLines.findIndex(line =>
      line.trim().startsWith('# ') || line.trim().startsWith('## ')
  );

  const imageMarkdown = `![thumbnail](${imageUrl})`;

  if (headingIndex === -1) {
      // No heading found — just put image at the top
      return `${imageMarkdown}\n\n${filteredLines.join('\n')}`;
  }

  // Insert image below heading
  filteredLines.splice(headingIndex + 1, 0, imageMarkdown);
  return filteredLines.join('\n');
}


export function replaceLinkInReadme(readmeText: string, oldLink: string, newLink: string): string {
  const escapedOldLink = oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex
  const regex = new RegExp(escapedOldLink, 'g');
  return readmeText.replace(regex, newLink);
}

export function extractThumbnailImage(readmeText: string): string | null {
  const lines = readmeText.split('\n').slice(0, 5); // Check only top 5 lines
  const imageRegex = /!\[[^\]]*\]\((.*?)\)/; // Markdown image format ![alt](url)

  for (const line of lines) {
      const match = imageRegex.exec(line);
      if (match && match[1]) {
          return match[1]; // Return image URL
      }
  }
  return null;
}