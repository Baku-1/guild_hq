import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

interface SummaryTabProps {
  summary: string;
}

export function SummaryTab({ summary }: SummaryTabProps) {
  return (
    <div>
        <h2 className="text-2xl font-headline mb-4">Guild Activity Summary</h2>
        <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Newspaper className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline text-xl">Latest Dispatch</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                    {summary}
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
