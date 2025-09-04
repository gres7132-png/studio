import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import AiSuggestions from "@/components/ai-suggestions";
import { formatCurrency } from "@/lib/utils";

// Mock data removed as per user request to clean up the codebase.
// In a real application, this data would be fetched from a database.
const investmentPackages: any[] = [];

export default function InvestPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investment Packages</h1>
        <p className="text-muted-foreground">
          Choose a package that suits your financial goals.
        </p>
      </div>

      <AiSuggestions />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {investmentPackages.map((pkg) => (
          <Card
            key={pkg.name}
            className="flex flex-col transform hover:scale-105 transition-transform duration-300"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{pkg.name}</CardTitle>
                {pkg.badge && <Badge variant="destructive">{pkg.badge}</Badge>}
              </div>
              <CardDescription>Starts from {formatCurrency(pkg.price)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <p className="text-4xl font-bold">{pkg.roi}</p>
                <p className="text-muted-foreground">for {pkg.duration}</p>
              </div>
              <ul className="space-y-2 text-sm">
                {pkg.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Invest Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {investmentPackages.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Investment packages will be available soon. Please check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
