export interface News {
  id: string;
  subscriptionId: string;
  title: string;
  url: string;
  content: string;
  summary?: string;
  publishedAt: Date;
  createdAt: Date;
}
