"use client";

import React, { ReactNode, useRef, useState } from "react";
import { toaster } from "../toaster";

interface Props {
  accept?: string;
  maxSize?: number;
  onSelected?: (file: File) => void;
  loading?: boolean;
  disabled?: boolean;
  children?: string;
  className?: string;
  renderChildren: (args: {
    fileBase64?: string;
    loading?: boolean;
    disabled?: boolean;
    handleClick: () => void;
  }) => ReactNode;
}

//TODO: not finished
export default function FileUploadButton({
  accept = "image/*",
  maxSize = 10,
  onSelected,
  loading,
  disabled,
  renderChildren,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileBase64, setFileBase64] = useState<string>();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const size = parseFloat((file.size / 1024 / 1024).toFixed(4));

      if (size > maxSize) {
        toaster.error(`The maximum file size is ${maxSize} MB`);
      } else if (onSelected) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setFileBase64(e.target?.result?.toString());
        };

        reader.readAsDataURL(file);

        onSelected(file);
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={loading || disabled}
      />
      {renderChildren({ fileBase64, handleClick, loading, disabled })}
      {/* <Button
        className={className}
        variant="outlined"
        leftIcon={<UploadIcon strokeColor="stroke-dark" />}
        iconSize="lg"
        onClick={handleClick}
        loading={loading}
        disabled={disabled}
      >
        {children || t("upload")}
      </Button> */}
    </>
  );
}
