import React, { useRef, useState } from "react";
import config from "@/lib/config";
import { IKImage, IKUpload, IKVideo, ImageKitProvider } from "imagekitio-next";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Loading from "@/components/Loading";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

interface Props {
  type: "Image" | "Video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    throw new Error(`Authentication failed with error: ${error.message}`);
  }
};

const FileUpload = ({
  onFileChange,
  type,
  placeholder,
  accept,
  folder,
  variant,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{
    url: string;
    name: string;
    filePath: string;
  } | null>();
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const { toast } = useToast();
  const [progress, setProgress] = useState<number>(0);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",

    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onError = (err: any) => {
    setFile(null);
    console.log(err);
    toast({
      title: `${type} failed to upload`,
      description: `Your ${type} failed to upload. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (
    res: {
      url: string;
      name: string;
      filePath: string;
    } | null,
  ) => {
    if (!res) return;
    onFileChange(res.url);
    setFile(res);
    console.log(res);
    toast({
      title: `${type} uploaded successfully`,
      description: `${res.name} uploaded successfully`,
    });
  };

  const onValidate = (file: File) => {
    if (type === "Image") {
      if (!file.type.startsWith("image")) {
        toast({
          title: `${type} files only please!`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 1024 * 1024 * 20) {
        toast({
          title: `${type} too large max size is 20MB`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (type === "Video") {
      if (!file.type.startsWith("video")) {
        toast({
          title: `${type} files only please!`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: `${type} too large max size is 50MB`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  return (
    <ImageKitProvider
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        className={"hidden"}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
      />

      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            ikUploadRef.current?.click();
          }
        }}
      >
        {!file && progress == 0 && (
          <>
            <Image
              src={"/icons/upload.svg"}
              alt={"Upload icon"}
              width={20}
              height={20}
              className={"object-contain"}
            />

            <p className={cn("text-base text-light-100", styles.placeholder)}>
              {placeholder}
            </p>
          </>
        )}

        {progress > 0 && progress != 100 && (
          <div className={"flex w-full items-center rounded-full"}>
            <div
              className={"progress text-center text-base font-light"}
              style={{
                width: `${progress}%`,
              }}
            >
              {progress}%
            </div>
          </div>
        )}

        {progress == 100 && !isHidden && (
          <div
            className={
              "mx-1 flex items-center justify-center rounded-full bg-blue-100/20"
            }
          >
            <Loading isHidden={false} />
          </div>
        )}

        {file && type === "Image" && (
          <IKImage
            alt={file.name}
            path={file.filePath}
            width={500}
            height={300}
            onLoad={() => setIsHidden(true)}
            className={"rounded-xl object-contain"}
          />
        )}

        {file && type === "Video" && (
          <IKVideo
            path={file.filePath}
            alt={file.name}
            width={500}
            height={300}
            onLoad={() => setIsHidden(true)}
            className={"h-0 w-full"}
          />
        )}
      </button>
    </ImageKitProvider>
  );
};
export default FileUpload;
