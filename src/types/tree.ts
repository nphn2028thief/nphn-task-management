export type Type = "FOLDER" | "FILE";
export type TFileType = "txt" | "md";
export type TLevel = 1 | 2 | 3 | 4;

export interface ITree {
  id: number;
  name: string;
  type: Type;
  fileType?: TFileType;
  level: TLevel;
  isOpen: boolean;
  parentId: number | null;
  children: ITree[];
}

export interface ITreeRequest {
  name: string;
  type: Type;
  fileType?: TFileType;
  level: TLevel;
  isOpen: boolean;
  parentId: number | null;
}

export interface ITreeResponse {
  id: number;
  name: string;
  type: Type;
  fileType?: TFileType;
  level: TLevel;
  isOpen: boolean;
  parentId: number | null;
  children: ITree[];
  createdAt: string;
  updatedAt: string;
}
