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

export type LocationLike = {
  id?: number;
  city_name?: string;
  latitude?: number | string;
  longitude?: number | string;
};

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: LocationLike | null;
}

export default function LocationModal({ open, onOpenChange, location }: LocationModalProps) {
  const isEdit = !!location?.id;

  const [cityNameValue, setCityNameValue] = React.useState<string>(location?.city_name ?? "");
  const [latitudeValue, setLatitudeValue] = React.useState<string | number>(location?.latitude ?? "");
  const [longitudeValue, setLongitudeValue] = React.useState<string | number>(location?.longitude ?? "");

  React.useEffect(() => {
    setCityNameValue(location?.city_name ?? "");
    setLatitudeValue(location?.latitude ?? "");
    setLongitudeValue(location?.longitude ?? "");
  }, [location?.id]);

  const onClose = () => {
    onOpenChange(false);
    setCityNameValue("");
    setLatitudeValue("");
    setLongitudeValue("");
  };

  // Inertia validation errors
  const page = usePage<{ errors?: Record<string, string> }>();
  const errors = (page.props as any)?.errors ?? {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit location" : "Create location"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the location details." : "Create a new location."}
          </DialogDescription>
        </DialogHeader>

        <Form
          className="grid gap-4"
          action={isEdit && location?.id ? `/admin/locations/${location.id}` : "/admin/locations"}
          method={isEdit ? "put" : "post"}
          transform={(formData) => ({
            ...formData,
            city_name: cityNameValue || undefined,
            latitude: latitudeValue === "" ? undefined : Number(latitudeValue),
            longitude: longitudeValue === "" ? undefined : Number(longitudeValue),
          })}
          onSuccess={() => {
            toast.success(isEdit ? "Location updated" : "Location created");
            onClose();
          }}
          onError={() => {
            toast.error("Failed to save location");
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="city_name">City Name</Label>
            <Input
              id="city_name"
              name="city_name"
              value={cityNameValue}
              onChange={(e) => setCityNameValue(e.target.value)}
              placeholder="e.g. Nairobi"
            />
            {errors.city_name && (
              <p className="text-xs text-destructive mt-1">{errors.city_name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={latitudeValue as any}
              onChange={(e) => setLatitudeValue(e.target.value)}
              placeholder="-1.286389"
            />
            {errors.latitude && (
              <p className="text-xs text-destructive mt-1">{errors.latitude}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={longitudeValue as any}
              onChange={(e) => setLongitudeValue(e.target.value)}
              placeholder="36.817223"
            />
            {errors.longitude && (
              <p className="text-xs text-destructive mt-1">{errors.longitude}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save changes" : "Create location"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}