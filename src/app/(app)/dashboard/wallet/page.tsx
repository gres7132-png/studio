"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const withdrawalSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be positive." })
    .min(10, { message: "Minimum withdrawal is $10." }),
});

const bankingDetailsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required."),
  accountHolder: z.string().min(1, "Account holder name is required."),
  accountNumber: z.string().min(1, "Account number is required."),
  routingNumber: z.string().min(1, "Routing number is required."),
});

export default function WalletPage() {
  const { toast } = useToast();

  const withdrawalForm = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
  });

  const bankingDetailsForm = useForm<z.infer<typeof bankingDetailsSchema>>({
    resolver: zodResolver(bankingDetailsSchema),
    defaultValues: {
      bankName: "Global Trust Bank",
      accountHolder: "John Doe",
      accountNumber: "••••••••1234",
      routingNumber: "•••••4321",
    },
  });

  function onWithdrawalSubmit(values: z.infer<typeof withdrawalSchema>) {
    console.log("Withdrawal request:", values);
    toast({
      title: "Withdrawal Requested",
      description: `Your request to withdraw ${formatCurrency(values.amount)} is being processed.`,
    });
    withdrawalForm.reset();
  }

  function onBankingDetailsSubmit(values: z.infer<typeof bankingDetailsSchema>) {
    console.log("Banking details update:", values);
    toast({
      title: "Banking Details Updated",
      description: "Your banking information has been saved securely.",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and banking details.
        </p>
      </div>

      <Tabs defaultValue="withdraw" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="banking">Banking Details</TabsTrigger>
        </TabsList>
        <TabsContent value="withdraw">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>
                Transfer your proceeds to your bank account. Processing may take 3-5 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...withdrawalForm}>
                <form
                  onSubmit={withdrawalForm.handleSubmit(onWithdrawalSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={withdrawalForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" placeholder="0.00" className="pl-8" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Withdrawable balance: {formatCurrency(1234.56)}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Request Withdrawal</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="banking">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Banking Details</CardTitle>
              <CardDescription>
                This information is used for processing your withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...bankingDetailsForm}>
                <form
                  onSubmit={bankingDetailsForm.handleSubmit(onBankingDetailsSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={bankingDetailsForm.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Bank Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bankingDetailsForm.control}
                    name="accountHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bankingDetailsForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bankingDetailsForm.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="0987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Save Details</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
