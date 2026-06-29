import React, { FC } from "react";
import PersonIcon from "../../icons/Person";
import Image from "next/image";

type Props = {
  name: string;
  avatar?: string;
  hideAvatar?: boolean;
};

const UserNameWithAvatar: FC<Props> = ({ name, avatar, hideAvatar }) => {
  return (
    <div className="w-full h-full flex items-center gap-4">
      <div className="w-12 h-12 rounded-md overflow-hidden">
        {!hideAvatar && avatar && (
          <Image
            width={48}
            height={48}
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        )}

        {!hideAvatar && !avatar && (
          <div className="w-full h-full flex justify-center items-center bg-greyOutline">
            <PersonIcon className="w-7 h-7 stroke-greyPrimary" />
          </div>
        )}
      </div>
      <p className="font-bold">{name}</p>
    </div>
  );
};

export default UserNameWithAvatar;
