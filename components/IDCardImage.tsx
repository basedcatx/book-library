"use client";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";

export const IdCardImage = ({ path }: { path: string }) => {
  return (
    <div>
      <Suspense
        fallback={<Skeleton className="h-[200px] w-[300px] rounded-sm" />}
      >
        <IKImage
          alt={"ID"}
          height={200}
          width={300}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          path={path}
        />
      </Suspense>
    </div>
  );
};
