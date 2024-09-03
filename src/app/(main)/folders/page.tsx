import PageTitle from "@/components/PageTitle";
import Folders from "@/components/Folders";

function FoldersPage() {
  return (
    <main className="h-full flex flex-col gap-4">
      <PageTitle title="Folder Workspaces" />
      <Folders />
    </main>
  );
}

export default FoldersPage;
