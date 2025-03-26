import React, { useRef, useState } from "react";
import config from "@/lib/config";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status code ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error) {
    throw new Error(`Authentication failed with error: ${error.message}`);
  }
};

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ url: string; name: string } | null>(null);
  const { toast } = useToast();

  const onError = (err: any) => {
    console.error(err.message);
    toast({
      title: "Image failed to upload",
      description: `Your image failed to upload. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    if (!res) return;
    onFileChange(res.url);
    setFile(res);
    console.log(res);
    toast({
      title: "Image uploaded successfully",
      description: `${res.name} uploaded successfully`,
    });
  };

  return (
    <ImageKitProvider
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        type={"image"}
        ref={ikUploadRef}
        className={"hidden"}
        onError={onError}
        onSuccess={onSuccess}
        fileName={"test-upload.png"}
      />

      <button
        className={"upload-btn"}
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            ikUploadRef.current?.click();
          }
        }}
      >
        {!file && (
          <>
            <Image
              src={"/icons/upload.svg"}
              alt={"Upload icon"}
              width={20}
              height={20}
              className={"object-contain"}
            />
            <p className={"text-base text-light-100"}>Upload a file</p>
          </>
        )}

        {file && (
          <IKImage
            alt={file.name}
            path={file.filePath}
            width={500}
            height={300}
          />
        )}
      </button>
    </ImageKitProvider>
  );
};
export default ImageUpload;
