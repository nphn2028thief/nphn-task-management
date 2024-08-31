import { IParams } from "@/types/params";

function FileDetailPage({ params }: IParams) {
  return <div>File: {params.id}</div>;
}

export default FileDetailPage;
