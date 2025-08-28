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
import { Car } from "@/types/cars";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CarLike = Partial<Car>;

interface CarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car?: Car | null;
}

export default function CarModal({ open, onOpenChange, car }: CarModalProps) {
  const isEdit = !!car?.id;

  const [brandValue, setBrandValue] = React.useState<string>(car?.brand ?? "");
  const [modelValue, setModelValue] = React.useState<string>(car?.model ?? "");
  const [bodyTypeValue, setBodyTypeValue] = React.useState<string>(car?.body_type ?? "");
  const [carTypeValue, setCarTypeValue] = React.useState<string>(car?.car_type ?? "");
  const [yearValue, setYearValue] = React.useState<string | number>(car?.year ?? "");
  const [priceValue, setPriceValue] = React.useState<string | number>(car?.price ?? "");
  const [mileageValue, setMileageValue] = React.useState<string | number>(car?.mileage ?? "");
  const [fuelTypeValue, setFuelTypeValue] = React.useState<string>(car?.fuel_type ?? "");
  const [colorValue, setColorValue] = React.useState<string>(car?.color ?? "");
  const [removedIds, setRemovedIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    setBrandValue(car?.brand ?? "");
    setModelValue(car?.model ?? "");
    setBodyTypeValue(car?.body_type ?? "");
    setCarTypeValue(car?.car_type ?? "");
    setYearValue(car?.year ?? "");
    setPriceValue(car?.price ?? "");
    setMileageValue(car?.mileage ?? "");
    setFuelTypeValue(car?.fuel_type ?? "");
    setColorValue(car?.color ?? "");
    setRemovedIds([]);
  }, [car?.id]);

  const onClose = () => {
    onOpenChange(false);
    setBrandValue("");
    setModelValue("");
    setBodyTypeValue("");
    setCarTypeValue("");
    setYearValue("");
    setPriceValue("");
    setMileageValue("");
    setFuelTypeValue("");
    setColorValue("");
  };

  const page = usePage<{ errors?: Record<string, string> }>();
  const errors = (page.props as any)?.errors ?? {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit car" : "Create car"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the car details." : "Create a new car."}
          </DialogDescription>
        </DialogHeader>

        <Form
          className="grid gap-6"
          action={isEdit && car?.id ? `/admin/cars/${car.id}` : "/admin/cars"}
          method="post"
          encType="multipart/form-data"
          transform={(formData) => ({
            ...formData,
            brand: brandValue || undefined,
            model: modelValue || undefined,
            body_type: bodyTypeValue || undefined,
            car_type: carTypeValue || undefined,
            year: yearValue === "" ? undefined : Number(yearValue),
            price: priceValue === "" ? undefined : Number(priceValue),
            mileage: mileageValue === "" ? undefined : Number(mileageValue),
            fuel_type: fuelTypeValue || undefined,
            color: colorValue || undefined,
          })}
          onSuccess={() => {
            toast.success(isEdit ? "Car updated" : "Car created");
            onClose();
          }}
          onError={() => {
            toast.error("Failed to save car");
          }}
        >
          {isEdit && car?.id ? (
            <input type="hidden" name="_method" value="put" />
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={brandValue}
                onChange={(e) => setBrandValue(e.target.value)}
                placeholder="e.g. Toyota"
              />
              {errors.brand && (
                <p className="text-xs text-destructive mt-1">{errors.brand}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                type="text"
                value={modelValue}
                onChange={(e) => setModelValue(e.target.value)}
                placeholder="e.g. Corolla"
              />
              {errors.model && (
                <p className="text-xs text-destructive mt-1">{errors.model}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="body_type">Body Type</Label>
              <Select value={bodyTypeValue} onValueChange={setBodyTypeValue}>
                <SelectTrigger aria-invalid={!!errors.body_type}>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MPV">MPV</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Wagon">Wagon</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                  <SelectItem value="Convertible">Convertible</SelectItem>
                </SelectContent>
              </Select>
              {errors.body_type && (
                <p className="text-xs text-destructive mt-1">{errors.body_type}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="car_type">Car Type</Label>
              <Select value={carTypeValue} onValueChange={setCarTypeValue}>
                <SelectTrigger aria-invalid={!!errors.car_type}>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
              {errors.car_type && (
                <p className="text-xs text-destructive mt-1">{errors.car_type}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={yearValue}
                onChange={(e) => setYearValue(e.target.value)}
                placeholder="e.g. 2022"
              />
              {errors.year && (
                <p className="text-xs text-destructive mt-1">{errors.year}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                placeholder="e.g. 100000"
              />
              {errors.price && (
                <p className="text-xs text-destructive mt-1">{errors.price}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={mileageValue}
                onChange={(e) => setMileageValue(e.target.value)}
                placeholder="e.g. 100000"
              />
              {errors.mileage && (
                <p className="text-xs text-destructive mt-1">{errors.mileage}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <Select value={fuelTypeValue ?? ""} onValueChange={setFuelTypeValue}>
                <SelectTrigger aria-invalid={!!errors.fuel_type}>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuel_type && (
                <p className="text-xs text-destructive mt-1">{errors.fuel_type}</p>
              )}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                type="text"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                placeholder="e.g. Red"
              />
              {errors.color && (
                <p className="text-xs text-destructive mt-1">{errors.color}</p>
              )}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="images">Images</Label>
              <Input id="images" name="images[]" type="file" multiple accept="image/jpeg,image/png,image/webp" />
              {(errors["images"] || errors["images.*"]) && (
                <p className="text-xs text-destructive mt-1">
                  {errors["images"] || errors["images.*"]}
                </p>
              )}
            </div>

            {isEdit && (car as any)?.media_items?.length > 0 && (
              <div className="grid gap-2 md:col-span-2">
                <Label>Current Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(car as any).media_items.map((m: any) => {
                    const checked = removedIds.includes(m.id);
                    return (
                      <label key={m.id} className="relative block">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={checked}
                          onChange={(e) => {
                            setRemovedIds((prev) =>
                              e.target.checked ? [...prev, m.id] : prev.filter((id) => id !== m.id)
                            );
                          }}
                        />
                        <div className="aspect-[4/3] w-full overflow-hidden rounded border bg-muted">
                          <img src={m.thumb_url || m.url} alt="media" className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {checked ? "Marked for removal" : "Keep"}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* hidden inputs for removed media ids */}
            {removedIds.map((id) => (
              <input key={id} type="hidden" name="removed_media_ids[]" value={id} />
            ))}
            {errors["removed_media_ids"] && (
              <p className="text-xs text-destructive mt-1">{errors["removed_media_ids"]}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save changes" : "Create car"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
