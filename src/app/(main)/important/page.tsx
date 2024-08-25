import PageTitle from "@/components/PageTitle";
import TaskList from "@/components/Task/List";
import TaskPanel from "@/components/modal/Task";

function ImportantPage() {
  return (
    <main className="h-full flex flex-col gap-4">
      <PageTitle title="important tasks" />
      <TaskList />
      <TaskPanel />
    </main>
  );
}

export default ImportantPage;
