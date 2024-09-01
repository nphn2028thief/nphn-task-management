import { Metadata } from "next";

import PageTitle from "@/components/PageTitle";
import TaskList from "@/components/Task/List";
import TaskPanel from "@/components/Modal/Task";

export const metadata: Metadata = {
  title: "All tasks",
};

export default function Home() {
  return (
    <main className="h-full flex flex-col gap-4">
      <PageTitle title="all tasks" />
      <TaskList />
      <TaskPanel />
    </main>
  );
}
