"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/layout/section-hero";

export default function Home() {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection onUploadClick={() => setIsUploadModalOpen(true)} />
     
    </div>
  );
}
