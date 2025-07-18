export interface Comment {
  id: number;
  author_name: string;
  author_email?: string;
  date: string;
  content: { rendered: string };
  parent?: number;
  status?: string;
}

export interface CommentFormData {
  author_name: string;
  author_email: string;
  content: string;
}

export interface CommentApiResponse {
  id: number;
  author_name: string;
  author_email: string;
  date: string;
  content: { rendered: string };
  parent: number;
  status: string;
  post: number;
}
