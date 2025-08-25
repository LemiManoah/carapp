import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const available = [
  'Alert', 'Avatar', 'Badge', 'Breadcrumb', 'Button', 'Calendar', 'Card', 'Checkbox', 'Collapsible', 'Dialog', 'Dropdown Menu',
  'Icon', 'Input', 'Label', 'Navigation Menu', 'Pagination', 'Select', 'Separator', 'Sheet', 'Sidebar', 'Skeleton', 'Switch', 'Tabs',
  'Toggle', 'Toggle Group', 'Tooltip'
];

export default function ComponentsList() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {available.map((name) => (
              <Badge variant="secondary" key={name}>{name}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Next Up</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Data Table, Advanced Pagination demos, and Date Picker examples can be added. We already installed calendar, pagination, switch, and tabs.
        </CardContent>
      </Card>
    </div>
  );
}
