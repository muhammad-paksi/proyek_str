"use client";

import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/navigation";
import validate from "validator";
import Tooltip from "@mui/material/Tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Checkbox,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useRipple } from 'use-ripple-hook';
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { google_sans_flex, nunito, google_sans, suse } from "@/lib/font";
import { signUp } from "@/server/auth/signup";

type ErrorMessage = {
  email?: string;
  password?: string;
  general?: string;
};
const rippleOptions = {color: "rgba(0, 0, 0, 0.2)"}

export default function SignUp() {
  const router = useRouter();
  // const { toast } = useToast();

  const [rippleOnSignup, eventOnSignup] = useRipple();
  const [rippleOnGoogle, eventOnGoogle] = useRipple(rippleOptions);
  const [rippleOnApple, eventOnApple] = useRipple(rippleOptions);
  const [rippleOnVK, eventOnVK] = useRipple(rippleOptions);
  const [rippleOnWeChat, eventOnWeChat] = useRipple(rippleOptions);
  const [rippleOnHF, eventOnHF] = useRipple(rippleOptions);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h2
        className={`mb-1 border-0 text-lg font-semibold text-neutral-700 ${suse.className}`}
      >
        Sign up to get started
      </h2>
      <Form
        className={`w-full h-fit flex flex-col gap-y-3 border-0 ${nunito.className}`}
        autoComplete="off"
      >
        <TextField isInvalid={!!errorMessage.email}>
          <Label
            htmlFor="email"
            className="w-fit font-semibold"
            onClick={(e) => {
              // Agar field tidak langsung aktif ketika label diklik
              // e.preventDefault();
            }}
          >
            Surel
          </Label>
          <Input
            id="email"
            type="email"
            variant="secondary"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {errorMessage.email ? (
            <FieldError>{errorMessage.email}</FieldError>
          ) : (
            <Description className="ml-2">you@example.com</Description>
          )}
        </TextField>
        <TextField isInvalid={!!errorMessage.password}>
          <Label
            htmlFor="password"
            className="w-fit font-semibold"
            onClick={(e) => {
              // Agar field tidak langsung aktif ketika label diklik
              // e.preventDefault();
            }}
          >
            Kata sandi
          </Label>
          <div className="flex w-full gap-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              variant="secondary"
              value={password}
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="flex-1 pr-10"
            />
            <Tooltip
              title={showPassword ? "Hide password" : "Reveal password"}
              placement="right"
            >
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
                className={`
                  flex-none 
                  p-1 
                  text-neutral-400 hover:text-neutral-600 
                  transition-colors cursor-pointer
                `}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewIcon : ViewOffIcon}
                  className="w-4.5 h-4.5"
                />
              </button>
            </Tooltip>
          </div>
          {errorMessage.password ? (
            <FieldError>{errorMessage.password}</FieldError>
          ) : (
            <Description>{/* Don't share it with anyone. */}</Description>
          )}
        </TextField>

        <Button
          type="submit"
          ref={rippleOnSignup}
          onPointerDown={eventOnSignup}
          onPress={async () => {
            setIsLoading(true);
            
            const user = await handleSubmit({ router, email, password, setEmail, setErrorMessage });
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);

            if (user) router.replace("/");
          }}
          isPending={isLoading}
          className={`w-full h-fit py-1.5 px-3 rounded-lg
        `}>
          {isLoading ? "Mendaftar..." : "Daftar"}
        </Button>
      </Form>

      <div className="mt-2 mb-1 w-full flex items-center border-0">
        <div className="flex-1 border-b border-gray-400/75"></div>
        <span className={`px-3 border-0 text-xs font-bold ${nunito.className}`}>
          atau
        </span>
        <div className="flex-1 border-b border-gray-400/75"></div>
      </div>

      <Tooltip title="It's Google, blud" placement="right">
        <Button
          ref={rippleOnGoogle}
          onPointerDown={eventOnGoogle}
          variant="outline"
          className={`
            w-full 
            flex items-center justify-center gap-3 
            rounded-md border-gray-300 
            hover:bg-blue-200/50
        `}>
          <Image
            src="/Google_Favicon_2025.svg"
            alt="Google icon"
            width={0} // Width ditentukan melalui css styling di atribut className
            height={0} // Height diset auto pada atribut className agar aspect ratio terjaga
            className="w-4.5 h-auto"
          />
          <p className={`font-normal ${google_sans_flex.className}`}>
            Daftar dengan Google
          </p>
        </Button>
      </Tooltip>

      <div className="mt-1 h-fit w-full flex items-center justify-between gap-x-2">
        <Tooltip title="Sign up with Apple" placement="bottom">
          <Button
            ref={rippleOnApple}
            onPointerDown={eventOnApple}
            variant="outline"
            className={`
              w-full 
              flex items-center justify-center gap-3 
              rounded-md border-gray-300 
              hover:bg-blue-200/50
          `}>
            <Image
              src="/icon-apple-brand.svg"
              alt="Apple icon"
              width={0} // Width ditentukan melalui css styling di atribut className
              height={0} // Height diset auto pada atribut className agar aspect ratio terjaga
              className="w-4.5 h-auto"
            />
            {/* <p className={`font-normal ${google_sans_flex.className}`}>
              Sign up with Google
            </p> */}
          </Button>
        </Tooltip>
        <Tooltip title="Sign up with VKontakte" placement="bottom">
          <Button
            ref={rippleOnVK}
            onPointerDown={eventOnVK}
            variant="outline"
            className={`
              w-full 
              flex items-center justify-center gap-3 
              rounded-md border-gray-300 
              hover:bg-blue-200/50
          `}>
            <Image
              src="/VK_Compact_Logo_(2021-present).svg"
              alt="VKontakte icon"
              width={0} // Width ditentukan melalui css styling di atribut className
              height={0} // Height diset auto pada atribut className agar aspect ratio terjaga
              className="w-4 h-auto"
            />
            {/* <p className={`font-normal ${google_sans_flex.className}`}>
              Sign up with Google
            </p> */}
          </Button>
        </Tooltip>
        <Tooltip title="Sign up with WeChat" placement="bottom">
          <Button
            ref={rippleOnWeChat}
            onPointerDown={eventOnWeChat}
            variant="outline"
            className={`
              w-full 
              flex items-center justify-center gap-3 
              rounded-md border-gray-300 
              hover:bg-blue-200/50
          `}>
            <Image
              src="/WeChat_logo.svg"
              alt="WeChat icon"
              width={0} // Width ditentukan melalui css styling di atribut className
              height={0} // Height diset auto pada atribut className agar aspect ratio terjaga
              className="w-5.75 h-auto"
            />
            {/* <p className={`font-normal ${google_sans_flex.className}`}>
              Sign up with Google
            </p> */}
          </Button>
        </Tooltip>
        <Tooltip title="Sign up with Hugging Face" placement="bottom">
          <Button
            ref={rippleOnHF}
            onPointerDown={eventOnHF}
            variant="outline"
            className={`
              w-full 
              flex items-center justify-center gap-3 
              rounded-md border-gray-300 
              hover:bg-blue-200/50
          `}>
            <Image
              src="/hf-logo.svg"
              alt="Hugging Face logo"
              width={0} // Width ditentukan melalui css styling di atribut className
              height={0} // Height diset auto pada atribut className agar aspect ratio terjaga
              className="w-6 h-auto"
            />
            {/* <p className={`font-normal ${google_sans_flex.className}`}>
              Sign up with Google
            </p> */}
          </Button>
        </Tooltip>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <p className={`text-sm font-normal ${google_sans_flex.className}`}>
          Already have an account?&nbsp;
          <a
            href="/account/signin"
            className={`text-sm font-medium text-blue-500 ${google_sans_flex.className}`}
          >
            Sign in
          </a>
        </p>
      </div>
    </>
  );
}

const handleSubmit = async ({ router, email, password, setEmail, setErrorMessage }
: {
  router: ReturnType<typeof useRouter>;
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setErrorMessage: (v: ErrorMessage) => void;
}): Promise<any | null> => {
  setErrorMessage({});

  const trimmedEmail = email.trim();
  setEmail(trimmedEmail); // In case email tidak valid, maka email di form sudah tanpa spasi.

  if (!trimmedEmail || !password) {
    setErrorMessage({ general: "Email and password cannot be empty" });
    return;
  }

  const errors: ErrorMessage = {};
  if (!validate.isEmail(trimmedEmail)) errors.email = "Invalid email address";
  if (!validate.isLength(password, { min: 6 }))
    errors.password = "Password must be at least 6 characters long";

  if (Object.keys(errors).length) {
    setErrorMessage(errors);
    return;
  }

  // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email: trimmedEmail, password, remember_me: rememberMe }),
  //   credentials: "include",
  // });
  const res = await signUp({email: trimmedEmail, password});
  
  return res.data?.user ? res.data.user : null;
  // if (res.data?.ok) router.replace("/kanban");
};
