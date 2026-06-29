import { cn } from "@/utils/cn";

interface Props {
  fillColor?: string;
}

export default function XTwitter({ fillColor }: Props) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M25.7812 25.5L15.7847 10.9295L15.8018 10.9432L24.8151 0.5H21.8031L14.4606 9L8.62969 0.5H0.730219L10.063 14.1034L10.0618 14.1023L0.21875 25.5H3.23078L11.394 16.0432L17.8818 25.5H25.7812ZM7.43625 2.77272L21.4621 23.2273H19.0752L5.03803 2.77272H7.43625Z"
        className={cn("transition fill-white", fillColor)}
      />
    </svg>
  );
}
