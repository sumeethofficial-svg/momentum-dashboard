import { useState } from "react";
import { Sparkles, Target } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMomentum, type Priority } from "./MomentumContext";

const categories = ["Product", "Fundraising", "Marketing", "Engineering", "Personal", "Operations"];
const priorities: Priority[] = ["High", "Med", "Low"];

export function CreateGoalModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addGoal } = useMomentum();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>("Med");
  const [description, setDescription] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const targetLabel = deadline
      ? new Date(deadline).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "TBD";
    addGoal({
      title,
      category: category || "Operations",
      target: targetLabel,
      priority,
      description,
    });
    toast.success("Goal created", { description: title });
    onOpenChange(false);
    setTitle("");
    setCategory("");
    setDeadline("");
    setPriority("Med");
    setDescription("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <DialogTitle className="text-xl tracking-tight">Create a new goal</DialogTitle>
          <DialogDescription>
            Momentum AI will structure milestones, forecast risk, and add it to your execution board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal title</Label>
            <Input
              id="title"
              placeholder="e.g. Ship AI Coach v2 to design partners"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Target deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    priority === p
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Outcome, success metric, and any known blockers…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-2 rounded-md border border-primary/25 bg-primary/5 p-3 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Momentum AI will auto-generate milestones, suggest a weekly cadence, and monitor risk continuously.
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            >
              Create Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
