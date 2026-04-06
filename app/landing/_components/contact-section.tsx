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
    <section id="contato" className="relative px-5 py-24 overflow-hidden">
  
  {/* 🔥 Glow de fundo */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
  <div className="absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-30" />

  <div className="mx-auto max-w-xl">
    
    {/* Header */}
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Entre em{" "}
        <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
          contato
        </span>
      </h2>

      <p className="mt-4 text-muted-foreground leading-relaxed">
        Tem uma dúvida ou sugestão? Envie sua mensagem e responderemos o
        mais rápido possível.
      </p>
    </div>

    {/* Card */}
    <div className="relative rounded-3xl border border-border/50 bg-background/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
      
      {/* Glow interno */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-destructive/10 opacity-50" />

      <div className="relative z-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            
            {/* Email */}
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
                      className="bg-background/80 backdrop-blur"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mensagem */}
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
                      className="bg-background/80 backdrop-blur"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback */}
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

            {/* CTA */}
            <Button
              type="submit"
              className="w-full gap-2 bg-gradient-to-r from-primary to-destructive text-white shadow-lg hover:opacity-90"
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
    </div>
  </div>
</section>
  );
}
