"use client"
import dynamic from "next/dynamic";
const GroceryCaptcha = dynamic(() => import("../components/Captcha"), {
  ssr: false,
});

export default function Home(){
  return (
    <div className="min-h-screen bg-sky-200 flex items-center justify-center p-6">
      <GroceryCaptcha />
    </div>
  );
};
