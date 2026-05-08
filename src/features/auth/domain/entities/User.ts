export interface User {
  id: string;
  email: string;
  nickname: string;
  bio?: string;
  profileImage?: string;
  name?: string;
  birthday?: string; // 'yyyy-MM-dd'
  age?: number;
  job?: string;
}
