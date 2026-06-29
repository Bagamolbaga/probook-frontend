import { cn } from "@/utils/cn";

const Badge = ({
  text,
  color,
  colorPreset,
}: {
  text: string;
  color?: string;
  colorPreset?: "grey";
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className={cn(
          "w-full py-2 flex justify-center items-center rounded overflow-hidden cursor-pointer",
          {
            "bg-greyPrimary/10": colorPreset === "grey",
          }
        )}
        style={
          colorPreset
            ? {}
            : {
                backgroundColor: `${color}20`,
              }
        }
      >
        <p
          className={cn("text-sm font-bold", {
            "text-greyPrimary": colorPreset === "grey",
          })}
          style={
            colorPreset
              ? {}
              : {
                  color,
                }
          }
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default Badge;
