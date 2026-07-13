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
  Link,
  TextField,
} from "@heroui/react";
import { useRipple } from 'use-ripple-hook';
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { google_sans_flex, nunito, google_sans, suse } from "@/lib/font";
import { signIn } from "@/server/auth/signin";

type ErrorMessage = {
  email?: string;
  password?: string;
  general?: string;
};
const rippleOptions = {color: "rgba(0, 0, 0, 0.2)"}

export default function SignIn() {
  const router = useRouter();
  // const { toast } = useToast();

  const [rippleOnSignin, eventOnSignin] = useRipple();
  const [rippleOnGoogle, eventOnGoogle] = useRipple(rippleOptions);

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
        Selamat datang!
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
            <Description className="ml-2">Anda@contoh.com</Description>
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

        <Checkbox
          id="remember-me"
          className="pl-2 w-fit gap-2 border-0"
          onChange={setRememberMe}
        >
          <Checkbox.Control
            className={
              rememberMe ? "shadow-none" : "shadow border border-neutral-300!"
            }
          >
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="remember-me">Ingat saya</Label>
          </Checkbox.Content>
        </Checkbox>

        <Button
          type="submit"
          ref={rippleOnSignin}
          onPointerDown={eventOnSignin}
          onPress={async () => {
            setIsLoading(true);
            
            const user = await handleSubmit({ router, email, password, rememberMe, setEmail, setErrorMessage });
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);

            if (user) router.replace("/");
          }}
          isPending={isLoading}
          className={`w-full h-fit py-1.5 px-3 rounded-lg
        `}>
          {isLoading ? "Mengautentikasi..." : "Masuk"}
        </Button>
      </Form>

      <a
        href="/akun/lupa_password"
        className={`
          mt-1 
          w-fit 
          pl-1 border-0 
          text-sm text-gray-600 hover:underline 
          font-normal ${suse.className}
      `}>
        Tidak dapat masuk akun?
      </a>

      <div className="mt-1 mb-1 w-full flex items-center border-0">
        <div className="flex-1 border-b border-gray-400/75"></div>
        <span className={`px-3 border-0 text-xs font-bold ${nunito.className}`}>
          OR
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
            Masuk dengan Google
          </p>
        </Button>
      </Tooltip>

      <div className="mt-2 flex items-center justify-center">
        <p className={`text-sm font-normal ${google_sans_flex.className}`}>
          Belum punya akun?&nbsp;
          <a
            href="/account/signup"
            className={`text-sm font-medium text-blue-500 ${google_sans_flex.className}`}
          >
            Daftar
          </a>
        </p>
      </div>
    </>
  );
}

const handleSubmit = async ({ router, email, password, rememberMe, setEmail, setErrorMessage }
: {
  router: ReturnType<typeof useRouter>;
  email: string;
  password: string;
  rememberMe: boolean;
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
  const res = await signIn({email: trimmedEmail, password, rememberMe});
  
  return res.data?.user ? res.data.user : null;
  // if (res.data?.ok) router.replace("/kanban");
};
