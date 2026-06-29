import { FC } from "react";
import Image, { StaticImageData } from "next/image";
import StarRating from "@/components/ui/startRaiting";

type Props = {
  name: string;
  reviewText: string;
  raiting: number;
  img: StaticImageData;
};

const ClientReviewCart: FC<Props> = ({ img, name, reviewText, raiting }) => {
  return (
    <div className="p-12 flex flex-col justify-start items-center gap-4 rounded-xl shadow-sm border border-greyBackground bg-white">
      <div className="w-[90px] h-[90px] rounded-full">
        <Image src={img} alt="Bowers" />
      </div>
      <p className="text-lg font-bold">{name}</p>
      <p className="">{reviewText}</p>
      <div className="flex items-center gap-4">
        <div className="-mt-1"><span className="text-xl font-medium">{raiting.toFixed(1)}/</span><span className="text-sm font-medium">5.0 rating</span></div>
        <StarRating size="sm" raiting={raiting} />
      </div>
    </div>
  );
};

export default ClientReviewCart;
