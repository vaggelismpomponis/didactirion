"use client";

import * as React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Παρακαλώ εισάγετε ένα έγκυρο email.",
  }),
  password: z.string().min(6, {
    message: "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Λάθος στοιχεία σύνδεσης. Παρακαλώ προσπαθήστε ξανά.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Κάτι πήγε στραβά. Παρακαλώ προσπαθήστε αργότερα.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left hero panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.06] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.04] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white text-center">
          <div className="mb-8">
            <Image
              src="/logo-main.png"
              alt="Διδακτήριον"
              width={300}
              height={120}
              className="h-20 w-auto object-contain drop-shadow-lg mx-auto"
              priority
            />
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight mb-4">
            Πίνακας
            <br />
            <span className="text-blue-300">Διαχείρισης</span>
          </h1>

          <p className="text-blue-200/60 text-base max-w-sm leading-relaxed">
            Διαχειριστείτε ανακοινώσεις, προγράμματα σπουδών, καθηγητές και
            το περιεχόμενο του ιστότοπου.
          </p>

          {/* Stats decorative */}
          <div className="mt-12 flex gap-8">
            {[
              { value: "17+", label: "Χρόνια" },
              { value: "2K+", label: "Μαθητές" },
              { value: "98%", label: "Επιτυχία" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-blue-300/50 font-bold mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile gradient header */}
        <div className="lg:hidden relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-[80px] pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo-main.png"
              alt="Διδακτήριον"
              width={220}
              height={88}
              className="h-14 w-auto object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Login form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              {/* Card header */}
              <div className="px-8 pt-8 pb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">
                  Σύνδεση Διαχειριστή
                </h2>
                <p className="text-sm text-slate-500">
                  Εισάγετε τα στοιχεία σας για πρόσβαση στο CMS.
                </p>
              </div>

              {/* Card body */}
              <div className="px-8 pb-8">
                {error && (
                  <Alert variant="destructive" className="mb-6 rounded-xl">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="admin@gmail.com"
                              className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                            Κωδικός Πρόσβασης
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-12"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent text-slate-400 hover:text-slate-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? "Σύνδεση..." : "Είσοδος"}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Card footer */}
              <div className="px-8 py-4 bg-slate-50/80 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  Η πρόσβαση περιορίζεται μόνο σε εξουσιοδοτημένους χρήστες.
                </p>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Επιστροφή στην ιστοσελίδα
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
