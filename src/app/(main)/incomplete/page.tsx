import { Metadata } from "next";

import PageTitle from "@/components/PageTitle";
import TaskList from "@/components/Task/List";
import TaskPanel from "@/components/Modal/Task";

export const metadata: Metadata = {
  title: "Incomplete tasks",
};

function IncompletePage() {
  return (
    <main className="h-full flex flex-col gap-4">
      <PageTitle title="incomplete tasks" />
      <TaskList />
      <TaskPanel />
    </main>
  );
}

export default IncompletePage;
