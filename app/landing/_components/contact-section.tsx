"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  email: z.string().email("Insira um email válido"),
  message: z.string().min(1, "A mensagem é obrigatória"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export function ContactSection() {
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
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
          from_email: data.email,
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
    <section id="contato" className="px-5 py-20">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Entre em contato
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tem uma dúvida ou sugestão? Envie sua mensagem e responderemos o
            mais rápido possível.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Quero tirar uma dúvida..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {feedback && (
                <p
                  className={`text-center text-sm ${
                    feedback.type === "success"
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {feedback.message}
                </p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={isPending}>
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
      </div>
    </section>
  );
}
