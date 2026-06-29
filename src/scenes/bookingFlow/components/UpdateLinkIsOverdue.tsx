import { Link } from "@/i18n";
import Button from "@/components/ui/button";
import Sad from "@/components/ui/icons/Sad";

const UpdateLinkIsOverdue = () => {
  return (
    <div className="absolute top-[78px] left-0 w-full h-full flex justify-center bg-greyBackgroundLight sm:px-5">
      <div className="max-w-[530px] h-fit mt-10 p-6 rounded-[20px] flex flex-col items-center gap-4 bg-white">
        <div className="w-16 h-16 mt-7 rounded-lg flex items-center justify-center bg-redPrimary">
          <Sad/>
        </div>
        <h2 className="font-bold text-center text-[26px]">
          The link you followed is no longer active.
        </h2>
        <p className="text-center text-greyPrimary">
          Booking links expire <span className="font-bold">3 hours</span> before your
          appointment. To reschedule or cancel, please contact the store directly.
        </p>
        <p className="text-center text-greyPrimary">Thank you for your understanding.</p>
        <Link href={"/"} className="mt-7">
          <Button variant="dark">Back to homepage</Button>
        </Link>
      </div>
    </div>
  );
};

export default UpdateLinkIsOverdue;
