"use client";

import {
  useDeleteCompanyImagesQuery,
  useGetCompaniesImagesQuery,
  useUploadCompanyImagesQuery,
} from "@/api/queries/company";
import Button from "@/components/ui/button";
import DeleteIcon from "@/components/ui/icons/Delete";
import Checkbox from "@/components/ui/inputs/Checkbox";
import Spinner from "@/components/ui/loaders/Spinner";
import { toaster } from "@/components/ui/toaster";
import { useAppSession } from "@/hooks/useAppSession";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useRef, useState } from "react";

const MAX_SIZE = 4;
const MAX_SELECT_IMAGES = 5;

type IBlobImage = {
  file: File;
  blobUrl: string;
};

const BlobImageCard = ({
  image,
  uploadLoading,
  isBiggerThanMaxSize,
  deleteImage,
}: {
  image: IBlobImage;
  uploadLoading?: boolean;
  isBiggerThanMaxSize?: boolean;
  deleteImage: (img: IBlobImage) => void;
}) => {
  return (
    <div
      className={cn(
        "relative size-[100px] rounded-md overflow-hidden border border-greyPrimary",
        {
          "border-2 border-redPrimary": isBiggerThanMaxSize,
        }
      )}
    >
      {uploadLoading && (
        <div className="absolute w-full h-full flex items-center justify-center bg-greyLight bg-opacity-50">
          <Spinner />
        </div>
      )}
      <span className="absolute left-1 top-1 px-1 text-xs font-bold text-purplePrimary bg-white rounded-md">
        new
      </span>
      <Button
        variant="resting-active"
        className="absolute top-1 right-1 p-[2px] !rounded hover:!border-redPrimary"
        onClick={() => deleteImage(image)}
      >
        <DeleteIcon className="w-4 h-4" />
      </Button>
      <Image
        className="w-full h-full object-cover"
        width={100}
        height={100}
        src={image.blobUrl}
        alt={image.file.name}
      />
    </div>
  );
};

const UploadedImageCard = ({
  image,
  isSelectedForDelete,
  onSelectForDelete,
  onUnSelectForDelete,
}: {
  image: IUploadImage;
  isSelectedForDelete?: boolean;
  onSelectForDelete: (img: IUploadImage) => void;
  onUnSelectForDelete: (img: IUploadImage) => void;
}) => {
  return (
    <div
      className="relative size-[100px] rounded-md overflow-hidden border cursor-pointer border-greyPrimary"
      onClick={() => {
        if (!isSelectedForDelete) {
          onSelectForDelete(image);
        } else {
          onUnSelectForDelete(image);
        }
      }}
    >
      <div className="absolute z-10 w-fit h-fit pl-1 pt-1">
        <Checkbox
          variant="delete"
          name={image.id.toString()}
          checked={isSelectedForDelete}
        />
      </div>
      <Image
        className="w-full h-full object-cover"
        width={100}
        height={100}
        src={image.image}
        alt={"Bowers"}
      />
    </div>
  );
};

const ImagesDetails = () => {
  const { companyId } = useGetCompanyId();

  const getCompaniesImagesQuery = useGetCompaniesImagesQuery({
    companyId,
  });
  const uploadCompanyImagesQuery = useUploadCompanyImagesQuery();
  const deleteCompanyImagesQuery = useDeleteCompanyImagesQuery();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<IBlobImage[]>([]);
  const [imagesBiggerThanMaxSize, setImagesBiggerThanMaxSize] = useState<IBlobImage[]>(
    []
  );
  const [imagesForDelete, setImagesForDelete] = useState<IUploadImage[]>([]);

  const [uploadImagesLoading, setUploadImagesLoading] = useState(false);
  const [deleteImagesLoading, setDeleteImagesLoading] = useState(false);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const selectImagesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_SELECT_IMAGES);

    if (files.length) {
      files.forEach((f) => {
        const size = parseFloat((f.size / 1024 / 1024).toFixed(4));

        if (size > MAX_SIZE) {
          setImagesBiggerThanMaxSize((prev) => [
            ...prev,
            {
              file: f,
              blobUrl: URL.createObjectURL(new Blob([f])),
            },
          ]);
        }
      });

      setSelectedImages(
        files.map((file) => ({
          file,
          blobUrl: URL.createObjectURL(new Blob([file])),
        }))
      );
    }
  };

  const uploadSelectedImages = async () => {
    try {
      setUploadImagesLoading(true);

      await uploadCompanyImagesQuery.mutateAsync({
        companyId,
        data: {
          files: selectedImages.map((i) => i.file),
        },
      });

      setSelectedImages([]);
      setUploadImagesLoading(false);
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const deleteSelectedUploadedImages = async () => {
    try {
      setDeleteImagesLoading(true);

      await deleteCompanyImagesQuery.mutateAsync({
        companyId,
        data: {
          imageIds: imagesForDelete.map((i) => i.id) || [],
        },
      });

      setImagesForDelete([]);
      setDeleteImagesLoading(false);
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const deleteSelectedImage = (img: IBlobImage) => {
    setSelectedImages((prev) => prev.filter((i) => i.file.name !== img.file.name));
    setImagesBiggerThanMaxSize((prev) =>
      prev.filter((i) => i.file.name !== img.file.name)
    );
  };

  const selectImageForDelete = (img: IUploadImage) => {
    setImagesForDelete((prev) => [...prev, img]);
  };

  const unSelectImageForDelete = (img: IUploadImage) => {
    setImagesForDelete((prev) => prev.filter((i) => i.id !== img.id));
  };

  const disableUploadBtn = uploadImagesLoading || Boolean(imagesBiggerThanMaxSize.length);

  return (
    <div className="w-full pt-5 flex flex-col">
      <p className="text-sm font-bold">Your salon images</p>
      <p className="text-sm text-greyPrimary">
        These images will be displayed on the page with detailed information about your
        salon
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {getCompaniesImagesQuery.data?.map((i) => (
          <UploadedImageCard
            key={i.id}
            image={i}
            isSelectedForDelete={Boolean(imagesForDelete.find((img) => img.id === i.id))}
            onSelectForDelete={selectImageForDelete}
            onUnSelectForDelete={unSelectImageForDelete}
          />
        ))}
        {selectedImages.map((i, idx) => (
          <BlobImageCard
            key={idx}
            image={i}
            isBiggerThanMaxSize={
              !!imagesBiggerThanMaxSize.find((img) => img.file.name === i.file.name)
            }
            uploadLoading={uploadImagesLoading}
            deleteImage={deleteSelectedImage}
          />
        ))}
      </div>
      {imagesBiggerThanMaxSize.length ? (
        <p className="mt-3 text-sm text-redPrimary">
          Some selected images exceed the maximum size{" "}
          <span className="font-bold">{MAX_SIZE} MB</span>
        </p>
      ) : null}
      <div className="mt-5 flex gap-3">
        <Button
          className="py-3"
          variant="primary-resting"
          onClick={selectedImages.length ? uploadSelectedImages : onButtonClick}
          disabled={disableUploadBtn}
        >
          {selectedImages.length ? "Upload new images" : "Select new images"}
          <input
            ref={fileInputRef}
            type="file"
            multiple={true}
            accept="image/png, image/jpg, image/jpeg"
            className="hidden"
            onChange={selectImagesHandler}
            disabled={uploadImagesLoading}
          />
        </Button>
        {imagesForDelete.length ? (
          <Button
            className="py-3"
            variant="red-outline"
            onClick={deleteSelectedUploadedImages}
            disabled={deleteImagesLoading}
          >
            Delete images
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ImagesDetails;
