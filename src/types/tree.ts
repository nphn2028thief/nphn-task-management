export type Type = "FOLDER" | "FILE";
export type TFileType = "txt" | "md";
export type TLevel = 1 | 2 | 3 | 4;

export interface ITree {
  id: string;
  name: string;
  type: Type;
  fileType?: TFileType;
  level: TLevel;
  isOpen: boolean;
  children: ITree[];
}

export interface ITreeRequest {
  name: string;
  type: Type;
  fileType?: TFileType;
  level: TLevel;
  isOpen: boolean;
  parentId: string | null;
  children: ITree[];
}

export interface ITreeResponse {
  id: string;
  name: string;
  type: Type;
  fileType?: TFileType;
  level: TLevel;
  isOpen: boolean;
  parentId: string | null;
  parent: ITreeResponse | null;
  children: ITree[];
  createdAt: string;
  updatedAt: string;
}
