import ConnectLine from "./components/ConnectLine";

const AccountNotificationsScene = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <div className="w-full flex-1 flex flex-col">
        <ConnectLine />
      </div>

      <div className="w-full mt-10 flex items-end justify-between">
        <div className="flex items-center gap-[46px]">
          {/* <Button variant="primary" onClick={form.handleSubmit(updateInformationHandler)}>
            Update Settings
          </Button>
          <Button variant="resting" className="py-3" onClick={cancelUpdateHandler}>
            Cancel
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default AccountNotificationsScene;
