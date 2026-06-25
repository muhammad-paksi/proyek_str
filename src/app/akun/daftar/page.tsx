"use client";

import { Card, Tabs } from "@heroui/react";
import SignUp from "@/components/auth/sign_up";

export default function Page() {
  return (
    <>
      <Card className="mt-2 w-90 h-fit p-5 pb-3.5 flex flex-col gap-y-2 border">
        <SignUp />
      </Card>
    </>
  );
}
