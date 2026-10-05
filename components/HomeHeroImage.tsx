"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/data/menu";

export default function HomeHeroImage() {
  const [image, setImage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/menu", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load the menu.");
        const jollofRice = (data.menuItems as MenuItem[]).find(
          (item) => item.name.trim().toLocaleLowerCase() === "jollof rice",
        );
        if (isMounted && jollofRice?.image) setImage(jollofRice.image);
      })
      .catch((error: unknown) => {
        console.error("Failed to load the Jollof Rice hero image:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt="Jollof Rice from Dfamiliz"
        onError={() => setImageFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return null;
}
