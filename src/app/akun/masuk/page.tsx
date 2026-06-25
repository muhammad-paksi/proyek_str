"use client";

import { Card, Tabs } from "@heroui/react";
import SignIn from "@/components/auth/sign_in";

export default function Page() {
  return (
    <>
      <Card className="mt-2 w-90 h-fit p-5 pb-3.5 flex flex-col gap-y-2 border">
        <SignIn />
      </Card>
    </>
  );
}
