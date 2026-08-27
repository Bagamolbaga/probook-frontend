"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import {
  useGetCompanyDetailsQuery,
  useUploadCompanyLogoQuery,
} from "@/api/queries/company";
import Button from "@/components/ui/button";
import FileUploadButton from "@/components/ui/button/FileUploadButton";
import PersonIcon from "@/components/ui/icons/Person";
import { toaster } from "@/components/ui/toaster";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

const CompanyLogo = () => {
  const { companyId } = useGetCompanyId();

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const uploadCompanyLogoQuery = useUploadCompanyLogoQuery();

  const [image, setImage] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleSelectImage = (file: File) => {
    setImage(file);
  };

  const handleUploadImage = async () => {
    try {
      if (companyId && image) {
        setUploadLoading(true);

        await uploadCompanyLogoQuery.mutateAsync({
          companyId,
          data: {
            logo: image,
          },
        });

        toaster.success("Company logo upload successfully");
        setUploadLoading(false);
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const prevLogo = useMemo(
    () => getCompanyDetailsQuery.data?.logo,
    [getCompanyDetailsQuery.data?.logo]
  );

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-bold">Your company logo</p>
      <div className="mt-5">
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
                  alt={`Company logo - ${getCompanyDetailsQuery.data?.name || ""}`}
                />
              ) : prevLogo ? (
                <Image
                  width={108}
                  height={108}
                  className="w-full h-full object-cover"
                  src={prevLogo}
                  alt={`Company logo - ${getCompanyDetailsQuery.data?.name || ""}`}
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

export default CompanyLogo;
