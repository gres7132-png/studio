
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { depositDetails } from "@/lib/config";

const withdrawableBalance = 0; // Set to 0 as per previous changes

const withdrawalSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be positive." })
    .min(10, { message: "Minimum withdrawal is $10." })
    .max(withdrawableBalance, { message: "Amount exceeds withdrawable balance." }),
});

const bankingDetailsSchema = z.object({
  paymentMethod: z.enum(["mobile", "crypto", "whatsapp"]),
  mobileNumber: z.string().optional(),
  cryptoCurrency: z.enum(["BTC", "ETH", "USDT"]).optional(),
  cryptoAddress: z.string().optional(),
  whatsappNumber: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === "mobile") return !!data.mobileNumber;
    if (data.paymentMethod === "crypto") return !!data.cryptoCurrency && !!data.cryptoAddress;
    if (data.paymentMethod === "whatsapp") return !!data.whatsappNumber;
    return true;
}, {
    message: "Please fill in the required details for the selected payment method.",
    path: ["paymentMethod"],
});

const depositSchema = z.object({
    transactionProof: z.string().min(10, "Please enter a valid transaction ID or hash."),
});

export default function WalletPage() {
  const { toast } = useToast();

  const withdrawalForm = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
  });

  const bankingDetailsForm = useForm<z.infer<typeof bankingDetailsSchema>>({
    resolver: zodResolver(bankingDetailsSchema),
    defaultValues: {
      paymentMethod: "mobile",
    },
  });

  const depositForm = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
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
      description: "Your payment information has been saved securely.",
    });
  }

  function onDepositSubmit(values: z.infer<typeof depositSchema>) {
    console.log("Deposit proof submitted:", values);
    toast({
      title: "Proof Submitted",
      description: "Your deposit is being verified and will reflect in your account shortly.",
    });
    depositForm.reset();
  }

  const selectedPaymentMethod = bankingDetailsForm.watch("paymentMethod");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Withdraw / Deposit</h1>
        <p className="text-muted-foreground">
          Manage your funds and payment details.
        </p>
      </div>

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="banking">Payment Details</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Make a Deposit</CardTitle>
                <CardDescription>
                    To add funds, please make a payment to one of the addresses below. These details are provided by the admin and may change.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-semibold">Company Payment Details</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong className="font-medium">Mobile Money (Airtel/Safaricom):</strong> {depositDetails.mobileMoney}</p>
                        <p><strong className="font-medium">BTC Address:</strong> {depositDetails.crypto.BTC}</p>
                        <p><strong className="font-medium">ETH Address:</strong> {depositDetails.crypto.ETH}</p>
                        <p><strong className="font-medium">USDT Address:</strong> {depositDetails.crypto.USDT}</p>
                        <p><strong className="font-medium">MiniPay (WhatsApp):</strong> {depositDetails.minipay}</p>
                    </div>
                </div>

                <Form {...depositForm}>
                    <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
                         <p className="text-sm text-muted-foreground">After making a payment, paste the transaction proof below and submit.</p>
                        <FormField
                            control={depositForm.control}
                            name="transactionProof"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proof of Transaction</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Paste the transaction hash, ID, or confirmation code here."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your account will be credited once the transaction is verified.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Submit Proof</Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="withdraw">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>
                A 15% service fee will be deducted from every withdrawal. Processing may take 3-5 business days.
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
                          Withdrawable balance: {formatCurrency(withdrawableBalance)}
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
              <CardTitle>My Payment Details</CardTitle>
              <CardDescription>
                This is the information we will use to send you your withdrawals.
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
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mobile">Mobile Money (Airtel/Safaricom)</SelectItem>
                            <SelectItem value="crypto">Crypto Wallet (BTC, ETH, USDT)</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp (MiniPay)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedPaymentMethod === "mobile" && (
                    <FormField
                      control={bankingDetailsForm.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 0712345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedPaymentMethod === "crypto" && (
                    <div className="space-y-4">
                      <FormField
                        control={bankingDetailsForm.control}
                        name="cryptoCurrency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cryptocurrency</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                <SelectItem value="USDT">Tether (USDT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={bankingDetailsForm.control}
                        name="cryptoAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wallet Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your wallet address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {selectedPaymentMethod === "whatsapp" && (
                     <FormField
                        control={bankingDetailsForm.control}
                        name="whatsappNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp Number (for MiniPay)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. +1234567890" {...field} />
                            </FormControl>
                             <FormDescription>
                                Include your country code.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  )}
                  
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
