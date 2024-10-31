export interface Feature {
  id: number;
  name: string;
  desc?: string; // 可选参数
}

export interface RootState {
  counter: number;
  name: string;
  token: string;
}

export interface UserState {
  name: string;
  token: string;
}
