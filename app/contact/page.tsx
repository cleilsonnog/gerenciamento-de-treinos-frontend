"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/app/_lib/auth-client";
import { BottomNav } from "@/app/_components/bottom-nav";

const contactSchema = z.object({
  message: z.string().min(1, "A mensagem é obrigatória"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export default function ContactPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsPending(true);
    setFeedback(null);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_email: session?.user?.email ?? "Usuário autenticado",
          from_name: session?.user?.name ?? "Usuário",
          message: data.message,
        },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! },
      );

      setFeedback({
        type: "success",
        message: "Mensagem enviada com sucesso! Responderemos em breve.",
      });
      form.reset();
    } catch {
      setFeedback({
        type: "error",
        message: "Erro ao enviar mensagem. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[88px]">
      <header className="flex h-14 items-center gap-3 px-5">
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        <span className="text-lg font-semibold text-foreground">Contato</span>
      </header>

      <section className="flex flex-col gap-6 px-5 pt-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Fale conosco
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tem uma dúvida ou sugestão? Envie sua mensagem e responderemos o
            mais rápido possível.
          </p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva sua dúvida ou sugestão..."
                        rows={5}
                        className="bg-background/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {feedback && (
                <p
                  className={`text-center text-sm font-medium ${
                    feedback.type === "success"
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {feedback.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {isPending ? "Enviando..." : "Enviar mensagem"}
              </Button>
            </form>
          </Form>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
