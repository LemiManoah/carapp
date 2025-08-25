import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ComponentsList from '@/components/ComponentsList';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Components', href: '/components' },
];

export default function ComponentsPage() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Components" />
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            Here you can find all the components available in the library. We are working on adding more components.
          </p>
        </div>
        <ComponentsList />
      </div>
    </AppLayout>
  );
}
