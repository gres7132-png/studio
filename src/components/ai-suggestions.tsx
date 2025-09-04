"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestInvestmentPackages } from "@/ai/flows/investment-package-suggestions";
import { Loader2, Sparkles } from "lucide-react";

export default function AiSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    
    // In a real application, you would fetch the user's profile from your database.
    const userProfile = `
      - User has been a member for 6 months.
      - Invested in the 'Starter' package twice.
      - Current capital is $2,500.
      - Expressed interest in moderate risk investments.
      - Age: 34.
    `;

    try {
      const result = await suggestInvestmentPackages({ userProfile });
      if (result.suggestedPackages) {
        setSuggestions(result.suggestedPackages);
      }
    } catch (e) {
      setError("Failed to get suggestions. Please try again later.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI-Powered Suggestions
        </CardTitle>
        <Button onClick={handleGetSuggestions} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Get Suggestions"
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center text-muted-foreground">
            Our AI is analyzing your profile to find the best packages for you...
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {suggestions.length > 0 && (
          <div className="grid gap-2">
            <p className="text-sm font-medium">Based on your profile, we suggest:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {!loading && suggestions.length === 0 && !error && (
            <p className="text-sm text-muted-foreground">
                Click "Get Suggestions" to receive personalized investment recommendations.
            </p>
        )}
      </CardContent>
    </Card>
  );
}
