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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

type PermissionLike = string | { id?: number; name: string };
export type RoleLike = {
  id?: number;
  name: string;
  permissions?: PermissionLike[];
};

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: RoleLike | null;
}

export default function RoleModal({ open, onOpenChange, role }: RoleModalProps) {
  const isEdit = !!role?.id;

  const initialSelected = React.useMemo(() => {
    const perms = role?.permissions ?? [];
    return new Set<string>(
      Array.isArray(perms)
        ? perms
            .map((p: any) => (typeof p === "string" ? p : p?.name))
            .filter(Boolean)
        : []
    );
  }, [role]);

  const [nameValue, setNameValue] = React.useState<string>(role?.name ?? "");
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    Set<string>
  >(initialSelected);

  React.useEffect(() => {
    setNameValue(role?.name ?? "");
    setSelectedPermissions(initialSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role?.id]);

  const onClose = () => {
    onOpenChange(false);
    // local inputs reset when modal closes
    setNameValue("");
    setSelectedPermissions(new Set());
  };

  // Get server-side validation errors from Inertia page props
  const page = usePage<{ errors?: Record<string, string>; permissionCategories?: Record<string, { label: string; permissions: string[] }> }>();
  const errors = (page.props as any)?.errors ?? {};
  const permissionCategories = (page.props as any)
    .permissionCategories as Record<string, { label: string; permissions: string[] }> | undefined;

  const togglePermission = (perm: string, checked: boolean | "indeterminate") => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(perm);
      } else {
        next.delete(perm);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit role" : "Create role"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the role name and permissions."
              : "Create a new role. Select the permissions that apply."}
          </DialogDescription>
        </DialogHeader>
        <Form
          className="grid gap-4"
          action={isEdit && role?.id ? `/admin/roles/${role.id}` : "/admin/roles"}
          method={isEdit ? "put" : "post"}
          transform={(formData) => ({
            ...formData,
            // Submit currently selected permissions
            permissions: Array.from(selectedPermissions),
          })}
          onSuccess={() => {
            toast.success(isEdit ? "Role updated" : "Role created");
            onClose();
          }}
          onError={() => {
            toast.error("Failed to save role");
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder="e.g. admin"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {permissionCategories && (
            <div className="space-y-4">
              {Object.entries(permissionCategories).map(([key, group]) => (
                <div key={key} className="rounded-md border p-3">
                  <div className="font-medium mb-2">{group.label}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {group.permissions.map((perm) => {
                      const checked = selectedPermissions.has(perm);
                      return (
                        <label key={perm} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(val) => togglePermission(perm, val)}
                          />
                          <span>{perm}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
              {(errors as any)["permissions.0"] && (
                <p className="text-xs text-destructive mt-1">
                  {(errors as any)["permissions.0"]}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save changes" : "Create role"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
