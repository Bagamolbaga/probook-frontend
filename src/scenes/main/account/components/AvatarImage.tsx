"use client";

import { useUploadUserAvatarQuery } from "@/api/queries/users";
import Button from "@/components/ui/button";
import FileUploadButton from "@/components/ui/button/FileUploadButton";
import PersonIcon from "@/components/ui/icons/Person";
import { toaster } from "@/components/ui/toaster";
import { useAppSession } from "@/hooks/useAppSession";
import Image from "next/image";
import { useState } from "react";

const AvatarImage = () => {
  const { data: session } = useAppSession();
  const prevAvatar = session?.user?.avatar || null;

  const uploadUserAvatarQuery = useUploadUserAvatarQuery();

  const [image, setImage] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleSelectImage = (file: File) => {
    setImage(file);
  };

  const handleUploadImage = async () => {
    try {
      if (session?.user && image) {
        setUploadLoading(true);

        await uploadUserAvatarQuery.mutateAsync({
          userId: session?.user?.id,
          data: {
            file: image,
          },
        });

        setUploadLoading(false);
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-bold">Your avatar image</p>
      <div className="pt-5">
        <FileUploadButton
          accept="image/png, image/jpg, image/jpeg"
          onSelected={handleSelectImage}
          renderChildren={({ fileBase64, handleClick }) => (
            <div
              className="w-[108px] h-[108px] flex justify-center items-center rounded-lg cursor-pointer overflow-hidden bg-purpleLightSecondary transition-all hover:bg-purpleExtraLight"
              onClick={handleClick}
            >
              {fileBase64 ? (
                <Image
                  width={108}
                  height={108}
                  className="w-full h-full object-cover"
                  src={fileBase64}
                  alt={session?.user?.first_name || ""}
                />
              ) : prevAvatar ? (
                <Image
                  width={108}
                  height={108}
                  className="w-full h-full object-cover"
                  src={prevAvatar}
                  alt={session?.user?.first_name || ""}
                />
              ) : (
                <PersonIcon className="w-10 h-10 stroke-blueDark" />
              )}
            </div>
          )}
        />
      </div>
      <Button
        className="mt-5 py-3"
        variant="primary-resting"
        onClick={handleUploadImage}
        disabled={!image || uploadLoading}
      >
        Upload
      </Button>
    </div>
  );
};

export default AvatarImage;
