const eventBox = ({ eventName, distance }) => {
  return (
    <div className="border border-x-0 opacity-50 justify-center">
      <div className="flex justify-between py-2">
        <h3 className="text-[20px]  text-white opacity-80">
          {eventName.length > 14 ? eventName.slice(0, 14) + "..." : eventName}
        </h3>
        <p className="text-[20px]  text-white opacity-80">{distance}</p>
        <p>&gt;</p>
      </div>
    </div>
  );
};

export default eventBox;
