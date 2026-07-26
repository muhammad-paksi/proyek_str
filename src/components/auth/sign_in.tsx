"use client";

import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  username?: string;
  password?: string;
  general?: string;
};
const rippleOptions = {color: "rgba(0, 0, 0, 0.2)"}

export default function SignIn() {
  const router = useRouter();

  const [rippleOnSignin, eventOnSignin] = useRipple();
  const [rippleOnGoogle, eventOnGoogle] = useRipple(rippleOptions);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h2 className={`mb-1 border-0 text-lg font-semibold text-neutral-700 ${suse.className}`}>
        Selamat datang!
      </h2>
      <Form
        className={`w-full h-fit flex flex-col gap-y-3 border-0 ${nunito.className}`}
        autoComplete="off"
      >
        <TextField isInvalid={!!errorMessage.username}>
          <Label
            htmlFor="username"
            className="w-fit font-semibold"
            onClick={(e) => {
              // Agar field tidak langsung aktif ketika label diklik
              // e.preventDefault();
            }}
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            variant="secondary"
            value={username}
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          {errorMessage.username ? (
            <FieldError>{errorMessage.username}</FieldError>
          ) : (
            <Description className="ml-2">contoh_username</Description>
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
            
            const user = await handleSubmit({ router, username, password, rememberMe, setUsername, setErrorMessage });
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);

            if (user) router.replace("/dasbor");
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

const handleSubmit = async ({ router, username, password, rememberMe, setUsername, setErrorMessage }
: {
  router: ReturnType<typeof useRouter>;
  username: string;
  password: string;
  rememberMe: boolean;
  setUsername: (v: string) => void;
  setErrorMessage: (v: ErrorMessage) => void;
}): Promise<any | null> => {
  setErrorMessage({});

  const trimmedUsername = username.trim();
  setUsername(trimmedUsername); // In case username tidak valid, maka username di form sudah tanpa spasi.

  if (!trimmedUsername || !password) {
    setErrorMessage({ general: "Username and password cannot be empty" });
    return;
  }

  const errors: ErrorMessage = {};
  if (!trimmedUsername) errors.username = "Username required";
  if (!password) errors.password = "Password required";

  if (Object.keys(errors).length) {
    setErrorMessage(errors);
    return;
  }

  const res = await signIn({username: trimmedUsername, password, rememberMe});
  
  return res?.data?.user ? res.data.user : null;
};
