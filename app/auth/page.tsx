"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";


const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="#4285F4"/>
    <path d="M1.508 4.86A8 8 0 0 0 0 8a8 8 0 0 0 1.508 4.645l2.952-2.297A4.792 4.792 0 0 1 3.25 8c0-.735.164-1.433.456-2.058L1.508 4.86z" fill="#FBBC05"/>
    <path d="M8 3.166c1.2 0 2.266.413 3.112 1.222l2.284-2.284A7.687 7.687 0 0 0 8 0C4.878 0 2.194 1.77.851 4.36l2.8 2.174C4.283 4.706 5.952 3.166 8 3.166z" fill="#EA4335"/>
    <path d="M8 16c2.158 0 3.978-.707 5.302-1.931l-2.726-2.116c-.756.49-1.73.78-2.576.78-2.087 0-3.857-1.408-4.492-3.301L.851 11.64C2.194 14.23 4.878 16 8 16z" fill="#34A853"/>
  </svg>
);

const AuthPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
    }
  }, [session, isPending, router]);

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
    if (error) {
      console.error(error);
    }
  };

  if (isPending || session) return null;

  return (
    <div className="flex h-full flex-col bg-foreground">
      <div className="flex flex-[2] items-end justify-center pt-20">
        <span className="text-6xl font-bold tracking-widest text-background">
          Treino.IA
        </span>
      </div>
      <div className="relative h-[60vh] bg-black">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="bg-primary px-5 pb-10 pt-12">
        <p className="text-center text-[32px] font-semibold leading-[1.05] text-primary-foreground">
          O app que vai transformar a forma como você treina.
        </p>

        <div className="mt-8 flex justify-center">
          <Button
            className="h-[38px] rounded-full bg-background px-6 text-sm font-semibold text-foreground gap-3 hover:bg-background/90 border-0 shadow-none"
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon />
            Fazer login com Google
          </Button>
        </div>

        <p className="mt-16 text-center text-xs text-primary-foreground/70">
          ©2026 Copyright Treino.IA. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
