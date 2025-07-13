export interface BlogType {
  _id?: string;
  blogId: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
  ownerName: string;
  lastEditTime: number | null,
  parentNodeIdArray?: string[] | null,

  viewStatus: string;
  blogTitle: string;
  blogTextContent: string;
  thumbnailUrl?: string | null;

  tags: string[];
  likes: string[];
  analyticsNumber: number;
  bookmarks: number;
  commentsNumber: number;
}


export interface pathChunkObject {
  path: string;
  sha: string;
  size: number;
  url: string;
  tokenEstimate: number;
};

export interface fileContentObject {
  path: string;
  sha: string;
  size: number;
  url: string;
  tokenEstimate: number;
  fileContent: string;
};

export interface fileSummaryObject {
  path: string,
  tokenEstimate: number,
  summary: string
}