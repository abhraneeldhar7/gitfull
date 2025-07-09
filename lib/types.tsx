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