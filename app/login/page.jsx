"use client";
import React from "react";
import Link from "next/link";
import LoginForm from "@/components/partials/auth/login-form";
import dynamic from "next/dynamic";

const Login2 = () => {
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6">
                  <Link href="/">
                    <img
                      src= "/assets/images/logo/logo-main.png"
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="text-sm">Admin Panel</h4>
                  {/* <div className="text-slate-500 dark:text-slate-400 text-base">
                    Login to Dashboard
                  </div> */}
                </div>
                <LoginForm />
              </div>
              <div className="auth-footer text-center">
                Copyright 2025, Rentitonline.ae All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login2;
