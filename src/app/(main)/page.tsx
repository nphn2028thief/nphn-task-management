import PageTitle from "@/components/PageTitle";
import TaskList from "@/components/Task/List";
import TaskPanel from "@/components/Modal/Task";

export default function Home() {
  return (
    <main className="h-full flex flex-col gap-4">
      <PageTitle title="all tasks" />
      <TaskList />
      <TaskPanel />
    </main>
  );
}
