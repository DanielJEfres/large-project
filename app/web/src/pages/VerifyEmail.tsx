import { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { X, Eye, EyeOff, Info } from "lucide-react";
import Logo from "../components/Logo";
import styles from "./Login.module.css";

export default function VerifyEmail() {
  return (
    <div className="[&_button]:cursor-pointer min-h-screen  bg-white flex flex-col justify-center items-center z-50">
      <div className="w-95">
        <div className={styles.logo}>
          <Logo />
        </div>

        <h1 className="font-bebas text-5xl text-center">Check your inbox</h1>

        <div className="mt-2">
          <p className=" text-center">
            We sent a verification link to{" "}
            <span className="text-brand">johndoe@game.com</span>
          </p>
          <p className="text-sm text-center text-gray-700 mt-1">
            Click the link to activate your account.
          </p>
        </div>
      </div>
    </div>
  );
}
