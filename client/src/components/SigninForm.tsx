"use client";
import React, { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { BottomGradient, LabelInputContainer } from ".";
import { Link, useNavigate } from "react-router-dom";
import {
  userHandleValidator,
  userPasswordValidator,
} from "@/validators/formValidators";
import axios from "axios";
import { BACKEND_BASE_URL } from "@/lib/helpers";
import { useSetRecoilState } from "recoil";
import { isAuthenticated } from "@/recoil-store/atoms/autheticationAtoms";

export function SigninForm() {
  let [isValidHandle, setIsValidHandle] = useState<boolean>(true);
  let [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  let [handleErrorMessage, setHandleErrorMessage] = useState<string>();
  let [passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
  let handleRef = useRef<HTMLInputElement>(null);
  let passwordRef = useRef<HTMLInputElement>(null);
  let navigate = useNavigate();
  let setIsAuthenticatedState = useSetRecoilState(isAuthenticated);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let parsedHandleResult = userHandleValidator.safeParse(
      handleRef.current?.value
    );
    if (!parsedHandleResult.success) {
      setIsValidHandle(false);
      setHandleErrorMessage(parsedHandleResult.error.issues[0].message);
    } else {
      setIsValidHandle(true);
    }
    let parsedPasswordResult = userPasswordValidator.safeParse(
      passwordRef.current?.value
    );
    if (!parsedPasswordResult.success) {
      setIsValidPassword(false);
      setPasswordErrorMessage(parsedPasswordResult.error.issues[0].message);
    } else {
      setIsValidPassword(true);
    }

    if (!(isValidHandle && isValidPassword)) {
      return;
    }
    try {
      await axios.post(
        `${BACKEND_BASE_URL}/auth/signin`,
        {
          handle: handleRef.current?.value,
          password: passwordRef.current?.value,
        },
        { withCredentials: true }
      );
      setIsAuthenticatedState(true);
      navigate("/myUrls");
    } catch (e) {
      console.log("Sigin failed:", e);
    }
  };

  return (
    <div className="min-w-96 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <form className="" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="handle" className="text-lg">
            Handle
          </Label>
          {!isValidHandle ? (
            <p className="text-red-700 ml-2 text-sm">{handleErrorMessage}</p>
          ) : null}
          <Input
            ref={handleRef}
            id="handle"
            placeholder="tyler77"
            type="text"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-lg">
            Password
          </Label>
          {!isValidPassword ? (
            <p className="text-red-700 ml-2 text-sm">{passwordErrorMessage}</p>
          ) : null}
          <Input
            ref={passwordRef}
            id="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign in &rarr;
          <BottomGradient />
        </button>
      </form>
      <div className="text-zinc-400 ml-3 mt-3 text-sm">
        If you don't have an account, click
        <Link to="/signup">
          <span className="cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 font-bold ml-1">
            here
          </span>
        </Link>
      </div>
    </div>
  );
}
