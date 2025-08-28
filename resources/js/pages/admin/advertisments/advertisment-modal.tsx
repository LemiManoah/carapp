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
import type { Advertisment } from "@/types/advertisments";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvertismentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertisment?: Advertisment | null;
}

export default function AdvertismentModal({ open, onOpenChange, advertisment }: AdvertismentModalProps) {
  const isEdit = !!advertisment?.id;

  const [carIdValue, setCarIdValue] = React.useState<string>(
    advertisment?.car_id !== undefined && advertisment?.car_id !== null ? String(advertisment.car_id) : ""
  );
  const [userIdValue, setUserIdValue] = React.useState<string>(
    advertisment?.user_id !== undefined && advertisment?.user_id !== null ? String(advertisment.user_id) : ""
  );
  const [titleValue, setTitleValue] = React.useState<string>(advertisment?.title ?? "");
  const [descriptionValue, setDescriptionValue] = React.useState<string>(
    (advertisment?.description as string) ?? ""
  );
  const [isActiveValue, setIsActiveValue] = React.useState<boolean>(advertisment?.is_active ?? true);
  const [allowsBiddingValue, setAllowsBiddingValue] = React.useState<boolean>(advertisment?.allows_bidding ?? false);

  type CarOption = { id: number; label: string; thumb_url?: string | null };
  type UserOption = { id: number; label: string; email?: string };
  const [carOptions, setCarOptions] = React.useState<CarOption[]>([]);
  const [userOptions, setUserOptions] = React.useState<UserOption[]>([]);
  const [loadingLookups, setLoadingLookups] = React.useState(false);

  React.useEffect(() => {
    setCarIdValue(
      advertisment?.car_id !== undefined && advertisment?.car_id !== null ? String(advertisment.car_id) : ""
    );
    setUserIdValue(
      advertisment?.user_id !== undefined && advertisment?.user_id !== null ? String(advertisment.user_id) : ""
    );
    setTitleValue(advertisment?.title ?? "");
    setDescriptionValue((advertisment?.description as string) ?? "");
    setIsActiveValue(advertisment?.is_active ?? true);
    setAllowsBiddingValue(advertisment?.allows_bidding ?? false);
  }, [advertisment?.id]);

  // Load lookup options when modal opens (best effort: props > API > fallback)
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function loadLookups() {
      try {
        setLoadingLookups(true);
        const nextCars: CarOption[] = [];
        const nextUsers: UserOption[] = [];

        // 1) Try to build from current page props if available
        try {
          const pageProps = (page as any).props as any;
          const carsFromProps = pageProps?.cars?.data || pageProps?.cars || [];
          const usersFromProps = pageProps?.users?.data || pageProps?.users || [];
          if (Array.isArray(carsFromProps)) {
            for (const c of carsFromProps) {
              nextCars.push({ id: c.id, label: `${c.brand} ${c.model}`, thumb_url: c.thumb_url });
            }
          }
          if (Array.isArray(usersFromProps)) {
            for (const u of usersFromProps) {
              nextUsers.push({ id: u.id, label: u.name ?? `User #${u.id}`, email: u.email });
            }
          }
        } catch {}

        // 2) If still empty, attempt API endpoints (optional; ignore errors)
        if (nextCars.length === 0) {
          try {
            const res = await fetch("/api/cars/options");
            if (res.ok) {
              const items = await res.json();
              for (const c of items) {
                nextCars.push({ id: c.id, label: `${c.brand} ${c.model}`, thumb_url: c.thumb_url });
              }
            }
          } catch {}
        }
        if (nextUsers.length === 0) {
          try {
            const res = await fetch("/api/users/options");
            if (res.ok) {
              const items = await res.json();
              for (const u of items) {
                nextUsers.push({ id: u.id, label: u.name ?? `User #${u.id}`, email: u.email });
              }
            }
          } catch {}
        }

        if (!cancelled) {
          // Ensure current selection exists in options for edit mode
          if (advertisment?.car && !nextCars.some((o) => o.id === advertisment.car!.id)) {
            nextCars.unshift({ id: advertisment.car.id, label: `${(advertisment.car as any).brand} ${(advertisment.car as any).model}`, thumb_url: (advertisment.car as any).thumb_url });
          }
          if (advertisment?.user && !nextUsers.some((o) => o.id === advertisment.user!.id)) {
            nextUsers.unshift({ id: advertisment.user.id, label: `${(advertisment.user as any).name}`, email: (advertisment.user as any).email });
          }
          setCarOptions(nextCars);
          setUserOptions(nextUsers);
        }
      } finally {
        if (!cancelled) setLoadingLookups(false);
      }
    }
    loadLookups();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const onClose = () => {
    onOpenChange(false);
    setCarIdValue("");
    setUserIdValue("");
    setTitleValue("");
    setDescriptionValue("");
    setIsActiveValue(true);
    setAllowsBiddingValue(false);
  };

  // Inertia validation errors
  const page = usePage<{ errors?: Record<string, string> }>();
  const errors = (page.props as any)?.errors ?? {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit advertisment" : "Create advertisment"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the advertisment details." : "Create a new advertisment."}
          </DialogDescription>
        </DialogHeader>

        <Form
          className="grid gap-6"
          action={isEdit && advertisment?.id ? `/admin/advertisments/${advertisment.id}` : "/admin/advertisments"}
          method="post"
          transform={(formData) => ({
            ...formData,
            car_id: carIdValue === "" ? undefined : Number(carIdValue),
            user_id: userIdValue === "" ? undefined : Number(userIdValue),
            title: titleValue || undefined,
            description: descriptionValue || undefined,
            is_active: isActiveValue,
            allows_bidding: allowsBiddingValue,
          })}
          onSuccess={() => {
            toast.success(isEdit ? "Advertisment updated" : "Advertisment created");
            onClose();
          }}
          onError={() => {
            toast.error("Failed to save advertisment");
          }}
        >
          {isEdit && advertisment?.id ? (
            <input type="hidden" name="_method" value="put" />
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Car</Label>
              <Select value={carIdValue} onValueChange={setCarIdValue}>
                <SelectTrigger aria-invalid={!!errors.car_id}>
                  <SelectValue placeholder={loadingLookups ? "Loading cars..." : "Select a car"} />
                </SelectTrigger>
                <SelectContent>
                  {carOptions.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      <span className="inline-flex items-center gap-2">
                        {c.thumb_url ? (
                          <img src={c.thumb_url} alt={c.label} className="h-6 w-8 rounded object-cover border" />
                        ) : (
                          <span className="h-6 w-8 rounded border bg-muted inline-block" />
                        )}
                        <span>{c.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.car_id && (
                <p className="text-xs text-destructive mt-1">{errors.car_id}</p>
              )}
              {/* Preview of selected car */}
              {(() => {
                const selected = carOptions.find((o) => String(o.id) === String(carIdValue));
                if (!selected) return null;
                return (
                  <div className="flex items-center gap-3">
                    {selected.thumb_url ? (
                      <img src={selected.thumb_url} className="h-12 w-16 rounded object-cover border" alt={selected.label} />
                    ) : (
                      <div className="h-12 w-16 rounded border bg-muted" />
                    )}
                    <div className="text-sm">
                      <div className="font-medium">{selected.label}</div>
                      <div className="text-muted-foreground">ID: {carIdValue}</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="grid gap-2">
              <Label>User</Label>
              <Select value={userIdValue} onValueChange={setUserIdValue}>
                <SelectTrigger aria-invalid={!!errors.user_id}>
                  <SelectValue placeholder={loadingLookups ? "Loading users..." : "Select a user"} />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      <span className="inline-flex flex-col leading-tight">
                        <span className="font-medium">{u.label}</span>
                        {u.email && <span className="text-xs text-muted-foreground">{u.email}</span>}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user_id && (
                <p className="text-xs text-destructive mt-1">{errors.user_id}</p>
              )}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                placeholder="e.g. Great car for sale"
              />
              {errors.title && (
                <p className="text-xs text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                placeholder="Write a short description..."
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">{errors.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="grid gap-1">
                <Label htmlFor="is_active">Active</Label>
                <p className="text-xs text-muted-foreground">Whether the advertisment is visible.</p>
              </div>
              <Switch id="is_active" checked={isActiveValue} onCheckedChange={setIsActiveValue} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="grid gap-1">
                <Label htmlFor="allows_bidding">Allows Bidding</Label>
                <p className="text-xs text-muted-foreground">Allow users to place bids.</p>
              </div>
              <Switch id="allows_bidding" checked={allowsBiddingValue} onCheckedChange={setAllowsBiddingValue} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save changes" : "Create advertisment"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
