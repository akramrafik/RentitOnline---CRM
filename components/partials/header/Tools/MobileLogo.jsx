import React from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";

import MainLogo from "@/assets/images/logo/logo-main.png";
import LogoWhite from "@/assets/images/logo/logo.png.svg";
const MobileLogo = () => {
  const [isDark] = useDarkMode();
  return (
    <Link href="/dashboard">
      <img src={isDark ? LogoWhite : MainLogo} alt="" />
    </Link>
  );
};

export default MobileLogo;
