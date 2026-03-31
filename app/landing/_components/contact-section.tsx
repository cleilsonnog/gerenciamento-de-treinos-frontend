"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Send } from "lucide-react";
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

async function sendContactMessage(_data: ContactFormValues) {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

export function ContactSection() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    sendContactMessage(data);
    form.reset();
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
              <Button type="submit" className="w-full gap-2">
                <Send size={16} />
                Enviar mensagem
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
