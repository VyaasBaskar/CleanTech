const SideBar = ({ visible = false }) => {
  if (!visible) {
    return (
      <div
        className="absolute bottom-10 right-8 w-[18vw] z-10 h-[85vh] rounded-2xl p-4 flex flex-col justify-center items-center text-center"
        style={{
          backdropFilter: "blur(3px)",
          background: "rgba(255, 255, 255, 0.4)",
          color: "rgba(255, 255, 255, 0.50)",
        }}
      >
        <p> Click any circle to view more details</p>
      </div>
    );
  }
  return (
    <div
      className="absolute bottom-10 right-8 w-[18vw] z-10 h-[85vh] rounded-2xl p-4 flex flex-col justify-between"
      style={{
        backdropFilter: "blur(3px)",
        background: "rgba(255, 255, 255, 0.4)",
      }}
    >
      <div>
        <img
          src="https://s3-alpha-sig.figma.com/img/d20e/18d5/63e25311db37c8621435698069865715?Expires=1714348800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RBWTH-taSv87ZvfHLEMtt5-KMNzXYWXW34QdIU~qb7Xi1x5-QsQtprxGL3z7EEdDunaL1c7PzpMKYoXGSpFex6xvvjAb6hcYuP2q4gDQDejmE8iMxrHw8FOyBn0~8~sMfXMPka0bWxynrECxN3r~nC1ToJc~hxweylfW0f75W0TzjMAH5K1H5yu7LFxCAhD3mZVXoCQbcMTXQBbHiBfYPbcMYyykF9zSirP2QUAsbTBzMA4SuxvOj49nRDAINpLtI-ZJKV9IsfBm4T7fwjjoG8S6PDr7c3Ef0Wep70-IibMwlbbFMBBQVE1R-8MIAF2WjugHlDt0pJyOrk~vzYT42w__"
          alt="search"
          className="h-[20vh] object-cover rounded-2xl"
        />

        <h2 className="text-[20px] text-white font-bold mt-5">
          What does this mean?
        </h2>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.70)",
          }}
          className="text-[16px]"
        >
          This area contains a high density of plastic as scanned by drone
          footage on 04/12/2023
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-[#D9D9D9] h-[44px] w-full text-gray-500 rounded-xl flex items-center p-4 font-medium  border-gray-500 border-2">
          Organize Event
        </div>
        <div className="bg-[#D9D9D9] h-[44px] w-full text-gray-500 rounded-xl flex items-center p-4 font-medium  border-gray-500 border-2">
          Help Cleanup{" "}
        </div>
        <div className="bg-[#D9D9D9] h-[44px] w-full text-gray-500 rounded-xl flex items-center p-4 font-medium  border-gray-500 border-2">
          Report Issue{" "}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
