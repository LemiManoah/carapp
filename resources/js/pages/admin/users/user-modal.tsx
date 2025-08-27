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

export type UserLike = {
  id?: number;
  name?: string;
  email?: string;
  contact?: string | null;
  location_id?: number | string | null;
  roles?: Array<string | { name: string } > | null;
};

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserLike | null;
}

export default function UserModal({ open, onOpenChange, user }: UserModalProps) {
  const isEdit = !!user?.id;

  // local state mirrors incoming user when opening
  const [nameValue, setNameValue] = React.useState<string>(user?.name ?? "");
  const [emailValue, setEmailValue] = React.useState<string>(user?.email ?? "");
  const [contactValue, setContactValue] = React.useState<string>(user?.contact ?? "");
  const [locationIdValue, setLocationIdValue] = React.useState<string | number | "">(user?.location_id ?? "");
  const [selectedRoles, setSelectedRoles] = React.useState<Set<string>>(
    new Set(
      (user?.roles ?? [])
        ?.map((r: any) => (typeof r === 'string' ? r : r?.name))
        .filter(Boolean)
    )
  );
  const [passwordValue, setPasswordValue] = React.useState<string>("");
  const [passwordConfirmValue, setPasswordConfirmValue] = React.useState<string>("");

  React.useEffect(() => {
    setNameValue(user?.name ?? "");
    setEmailValue(user?.email ?? "");
    setContactValue(user?.contact ?? "");
    setLocationIdValue(user?.location_id ?? "");
    setSelectedRoles(
      new Set(
        (user?.roles ?? [])
          ?.map((r: any) => (typeof r === 'string' ? r : r?.name))
          .filter(Boolean)
      )
    );
    setPasswordValue("");
    setPasswordConfirmValue("");
  }, [user?.id]);

  const onClose = () => {
    onOpenChange(false);
    setNameValue("");
    setEmailValue("");
    setContactValue("");
    setLocationIdValue("");
    setSelectedRoles(new Set());
    setPasswordValue("");
    setPasswordConfirmValue("");
  };

  // Read roles (array of names) and locations from shared props
  const page = usePage<{ errors?: Record<string, string>; roles?: string[]; locations?: Array<{ id: number|string; name: string }> }>();
  const errors = (page.props as any)?.errors ?? {};
  const roleOptions = (page.props as any)?.roles as string[] | undefined;
  const locations = (page.props as any)?.locations as Array<{ id: number|string; name: string }> | undefined;

  const toggleRole = (roleName: string, checked: boolean | "indeterminate") => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (checked) next.add(roleName);
      else next.delete(roleName);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Create user"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the user's details." : "Create a new user."}
          </DialogDescription>
        </DialogHeader>

        <Form
          className="grid gap-4"
          action={isEdit && user?.id ? `/admin/users/${user.id}` : "/admin/users"}
          method={isEdit ? "put" : "post"}
          transform={(formData) => ({
            ...formData,
            contact: contactValue || undefined,
            location_id: locationIdValue || undefined,
            roles: Array.from(selectedRoles),
          })}
          onSuccess={() => {
            toast.success(isEdit ? "User updated" : "User created");
            onClose();
          }}
          onError={() => {
            toast.error("Failed to save user");
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              name="contact"
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder="+1 555 0100"
            />
            {errors.contact && (
              <p className="text-xs text-destructive mt-1">{errors.contact}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location_id">Location</Label>
            <select
              id="location_id"
              name="location_id"
              className="border rounded-md h-9 px-3 bg-background"
              value={locationIdValue as any}
              onChange={(e) => setLocationIdValue(e.target.value)}
            >
              <option value="">Select location</option>
              {Array.isArray(locations) && locations.length > 0 ? (
                locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No locations found
                </option>
              )}
            </select>
            {errors.location_id && (
              <p className="text-xs text-destructive mt-1">{errors.location_id}</p>
            )}
          </div>

          {roleOptions && roleOptions.length > 0 && (
            <div className="grid gap-2">
              <Label>Roles</Label>
              <div className="rounded-md border p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {roleOptions.map((roleName) => {
                  const checked = selectedRoles.has(roleName);
                  return (
                    <label key={roleName} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggleRole(roleName, e.target.checked)}
                      />
                      <span>{roleName}</span>
                    </label>
                  );
                })}
              </div>
              {(errors as any)["roles.0"] && (
                <p className="text-xs text-destructive mt-1">{(errors as any)["roles.0"]}</p>
              )}
            </div>
          )}

          {!isEdit && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={passwordConfirmValue}
                  onChange={(e) => setPasswordConfirmValue(e.target.value)}
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save changes" : "Create user"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
