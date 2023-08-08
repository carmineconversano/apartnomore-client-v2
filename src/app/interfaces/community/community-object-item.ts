export interface CommunityObjectItem {
  collapsed?: boolean;
  id: number,
  name: string,
  isPublic: boolean,
  accessLink: string,
  password: string,
  description: string,
  location: string,
  subscribed?: boolean;
  image?: {
    path: string;
    id: number;
  };
  imagePath?: string;
  lat?: number;
  lng?: number;
  created?: string;
}
