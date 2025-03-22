import { KanbanBoard } from "@/src/components/dashboard/kanban/components/kanban-board";
import NewTaskDialog from "@/src/components/dashboard/kanban/new-task-dialog";
import { Heading } from "@/src/components/ui/heading";

export default function KanbanPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading title={`Kanban`} description="Manage tasks by dnd" />
        <NewTaskDialog />
      </div>
      <KanbanBoard />
    </div>
  );
}
