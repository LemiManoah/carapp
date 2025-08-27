"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@inertiajs/react";

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Endpoint to submit the DELETE request to */
  action: string | null;
  /** Optional title override */
  title?: string;
  /** Optional description override. You can include the item name here. */
  description?: React.ReactNode;
  /** Text for the confirm button */
  confirmLabel?: string;
  /** Text for the cancel button */
  cancelLabel?: string;
  /** Called after successful delete */
  onSuccess?: () => void;
  /** Called on delete error */
  onError?: () => void;
  /** Disable the confirm button */
  disabled?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  onOpenChange,
  action,
  title = "Delete",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onSuccess,
  onError,
  disabled,
}: ConfirmDeleteDialogProps) {
  const onClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form
          action={action ?? "#"}
          method="delete"
          onSuccess={() => {
            onSuccess?.();
            onClose();
          }}
          onError={() => {
            onError?.();
          }}
       >
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button type="submit" variant="destructive" disabled={!action || disabled}>
              {confirmLabel}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
