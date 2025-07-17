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

  // Remove any image markdown only from the top 4 lines
  const cleanedTop = lines.slice(0, 4).filter(
    line => !line.trim().match(/^!\[.*?\]\(.*?\)/)
  );

  const remainingLines = lines.slice(4);

  const filteredLines = [...cleanedTop, ...remainingLines];

  // Find top-level heading
  const headingIndex = filteredLines.findIndex(line =>
    line.trim().startsWith('# ') || line.trim().startsWith('## ')
  );

  const imageMarkdown = `![thumbnail](${imageUrl})`;

  if (headingIndex === -1) {
    // No heading found — insert at very top
    return `${imageMarkdown}\n\n${filteredLines.join('\n')}`;
  }

  // Insert image right below the heading
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


export const downloadReadmeFile = (readmeText: string, resThumbnailUrl: string | null, imageName: string) => {
  const content = readmeText;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'README.md';
  link.click();

  URL.revokeObjectURL(url);

  if (resThumbnailUrl) {
    fetch(resThumbnailUrl, { mode: 'cors' }) // mode: 'cors' is often necessary
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download =  imageName;
        a.click();
        URL.revokeObjectURL(blobUrl); // cleanup
      })
      .catch(console.error);
  }
};


export  function replaceRelativeLinks(
  markdown: string,
  owner: string,
  repo: string,
  branch: string
): string {
  const githubBase = `https://github.com/${owner}/${repo}/raw/${branch}/`;

  // This regex finds all markdown links or image paths starting with ./
  const relativeLinkRegex = /(\]\()(\.\/[^)]+)(\))/g;

  return markdown.replace(relativeLinkRegex, (_match, prefix, path, suffix) => {
      return `${prefix}${githubBase}${path.slice(2)}${suffix}`;
  });
}