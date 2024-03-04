"use client";
import React, { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { BottomGradient, LabelInputContainer } from ".";
import {
  userHandleValidator,
  userNameValidator,
  userPasswordValidator,
} from "@/validators/formValidators";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "@/lib/helpers";

export function SignupForm() {
  let [isValidName, setIsValidName] = useState<boolean>(true);
  let [isValidHandle, setIsValidHandle] = useState<boolean>(true);
  let [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  let [nameErrorMessage, setNameErrorMessage] = useState<string>();
  let [handleErrorMessage, setHandleErrorMessage] = useState<string>();
  let [passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
  let nameRef = useRef<HTMLInputElement>(null);
  let handleRef = useRef<HTMLInputElement>(null);
  let passwordRef = useRef<HTMLInputElement>(null);
  let navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let parsedNameResult = userNameValidator.safeParse(nameRef.current?.value);
    if (!parsedNameResult.success) {
      setIsValidName(false);
      setNameErrorMessage(parsedNameResult.error.issues[0].message);
    } else {
      setIsValidName(true);
    }
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

    if (!(isValidHandle && isValidPassword && isValidName)) {
      return;
    }

    await axios.post(
      `${BACKEND_BASE_URL}/auth/signup`,
      {
        name: nameRef.current?.value,
        handle: handleRef.current?.value,
        password: passwordRef.current?.value,
      },
      { withCredentials: true }
    );
    navigate("/signin");
  };
  return (
    <div className="min-w-96 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <form className="" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            {!isValidName ? (
              <p className="text-red-700 ml-2 text-sm">{nameErrorMessage}</p>
            ) : null}
            <Input ref={nameRef} id="name" placeholder="Tyler" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="handle">Handle</Label>
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
          <Label htmlFor="password">Password</Label>
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
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}
