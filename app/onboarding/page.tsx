import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getHome, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { OnboardingChat } from "./_components/onboarding-chat";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [homeResponse, trainDataResponse] = await Promise.all([
    getHome(today.format("YYYY-MM-DD"), { timezone }, { cache: "no-store" }),
    getUserTrainData({ cache: "no-store" }),
  ]);

  const hasTrainData =
    trainDataResponse.status === 200 && trainDataResponse.data !== null;
  const hasActivePlan =
    homeResponse.status === 200 && homeResponse.data.activeWorkoutPlanId;

  if (hasTrainData && hasActivePlan) redirect("/");

  return <OnboardingChat />;
}
