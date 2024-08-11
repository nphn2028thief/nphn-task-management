import PageTitle from "@/components/PageTitle";
import TaskList from "@/components/Task/List";
import TaskPanel from "@/components/Panels/Task";

function CompletedPage() {
  return (
    <main className="h-full flex flex-col gap-4">
      <PageTitle title="completed tasks" />
      <TaskList />
      <TaskPanel />
    </main>
  );
}

export default CompletedPage;
