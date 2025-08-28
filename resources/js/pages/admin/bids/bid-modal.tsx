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
import { Bid } from "@/types/bids";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bid?: Bid | null;
}

export default function BidModal({ open, onOpenChange, bid }: BidModalProps) {
  const isEdit = !!bid?.id;

  const [carIdValue, setCarIdValue] = React.useState<string>(
    bid?.car_id !== undefined && bid?.car_id !== null ? String(bid.car_id) : ""
  );
  const [userIdValue, setUserIdValue] = React.useState<string>(
    bid?.user_id !== undefined && bid?.user_id !== null ? String(bid.user_id) : ""
  );
  const [bidPriceValue, setBidPriceValue] = React.useState<string>(
    bid?.bid_price !== undefined && bid?.bid_price !== null ? String(bid.bid_price) : ""
  );
  const [bidStatusValue, setBidStatusValue] = React.useState<string>(bid?.bid_status ?? "");

  // Page props and errors
  const page = usePage<{ errors?: Record<string, string>; cars?: any; users?: any }>();
  const errors = (page.props as any)?.errors ?? {};

  type CarOption = { id: number; label: string; thumb_url?: string | null };
  type UserOption = { id: number; label: string; email?: string };
  const [carOptions, setCarOptions] = React.useState<CarOption[]>([]);
  const [userOptions, setUserOptions] = React.useState<UserOption[]>([]);
  const [loadingLookups, setLoadingLookups] = React.useState(false);

  React.useEffect(() => {
    setCarIdValue(
      bid?.car_id !== undefined && bid?.car_id !== null ? String(bid.car_id) : ""
    );
    setUserIdValue(
      bid?.user_id !== undefined && bid?.user_id !== null ? String(bid.user_id) : ""
    );
    setBidPriceValue(
      bid?.bid_price !== undefined && bid?.bid_price !== null ? String(bid.bid_price) : ""
    );
    setBidStatusValue(bid?.bid_status ?? "");
  }, [bid?.id]);

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
          if (bid?.car && !nextCars.some((o) => o.id === bid.car!.id)) {
            nextCars.unshift({ id: bid.car.id, label: `${(bid.car as any).brand} ${(bid.car as any).model}`, thumb_url: (bid.car as any).thumb_url });
          }
          if (bid?.user && !nextUsers.some((o) => o.id === bid.user!.id)) {
            nextUsers.unshift({ id: bid.user.id, label: `${(bid.user as any).name}`, email: (bid.user as any).email });
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
    setBidPriceValue("");
    setBidStatusValue("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit bid" : "Create bid"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the bid details." : "Create a new bid."}
          </DialogDescription>
        </DialogHeader>

        <Form
          className="grid gap-4"
          action={isEdit && bid?.id ? `/admin/bids/${bid.id}` : "/admin/bids"}
          method={isEdit ? "put" : "post"}
          transform={(formData) => ({
            ...formData,
            car_id: carIdValue === "" ? undefined : Number(carIdValue),
            user_id: userIdValue === "" ? undefined : Number(userIdValue),
            bid_price: bidPriceValue === "" ? undefined : Number(bidPriceValue),
            bid_status: bidStatusValue || undefined,
          })}
          onSuccess={() => {
            toast.success(isEdit ? "Bid updated" : "Bid created");
            onClose();
          }}
          onError={() => {
            toast.error("Failed to save bid");
          }}
        >
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

          <div className="grid gap-2">
            <Label htmlFor="bid_price">Bid Price</Label>
            <Input
              id="bid_price"
              name="bid_price"
              type="number"
              step="any"
              value={bidPriceValue}
              onChange={(e) => setBidPriceValue(e.target.value)}
              placeholder="e.g. Nairobi"
            />
            {errors.bid_price && (
              <p className="text-xs text-destructive mt-1">{errors.bid_price}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save changes" : "Create bid"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}