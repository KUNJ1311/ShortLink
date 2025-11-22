"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  error?: string | null;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  code,
  onConfirm,
  isDeleting,
  error,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-mono font-semibold">{code}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="px-6">
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
