import PageTitle from "@/components/PageTitle";
import TaskList from "@/components/Task/List";
import TaskPanel from "@/components/modal/Task";

function IncompletedPage() {
  return (
    <main className="h-full flex flex-col gap-4">
      <PageTitle title="incompleted tasks" />
      <TaskList />
      <TaskPanel />
    </main>
  );
}

export default IncompletedPage;
