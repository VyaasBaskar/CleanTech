import { set } from "ol/transform";
import { useState } from "react";

const MiniEventBox = ({ boxVisible, onClickX, miniBoxData }) => {
  const [check, setCheck] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCheckClick = () => {
    setCheck(true);
  };

  const handleSuccessClick = () => {
    setSuccess(true);
  };

  const content = selectedFile ? (
    <p className="italic text-[#ABABAB] mt-5 tracking-[2px] text-[1.2vw]">
      {selectedFile.name}
    </p>
  ) : (
    <p className="italic text-[#ABABAB] mt-5 tracking-[2px] text-[1.2vw]">
      or drop a file
    </p>
  );

  if (!boxVisible || isDone) return null;
  else if (check) {
    return (
      <div
        className="w-[100vw] h-[100vh] bg-black absolute z-30 flex justify-center items-center"
        style={{ background: "rgba(0, 0, 0, 0.4)" }}
      >
        <div
          className="w-[410px] h-[462px] p-8 flex flex-col"
          style={{
            borderRadius: 26,
            background: "rgba(255, 255, 255, 0.40)",
            backdropFilter: "blur(10px)",
          }}
        >
          <img
            src="/icon/x-circle.svg"
            alt="search"
            className="w-6 h-6 absolute right-8 top-8 cursor-pointer"
            onClick={() => {
              onClickX();
              setCheck(false);
            }}
          />
          <img
            src="/icon/check-circle.svg"
            alt="search"
            className="w-6 h-6 absolute right-8 top-16 cursor-pointer"
            onClick={() => {
              setCheck(false);
              handleSuccessClick();
            }}
          />
          <h1
            className="text-[24px] font-bold"
            style={{ color: "rgba(255, 255, 255, 0.70)" }}
          >
            {/* max 15 characters */}
            {miniBoxData.eventName.length > 22
              ? miniBoxData.eventName.slice(0, 22) + "..."
              : miniBoxData.eventName}
          </h1>
          <h2
            className="text-[20px] -mt-[5px]"
            style={{ color: "rgba(255, 255, 255, 0.60)" }}
          >
            {miniBoxData.address} - Ongoing
          </h2>
          <div className="w-[356px] h-[346px] border border-dashed rounded-xl mt-4 flex flex-col justify-center items-center">
            <img
              src="/icon/Subtract.svg"
              alt="event"
              className="w-full mt-8 h-36"
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              hidden
              id="actual-btn"
            />
            <label
              htmlFor="actual-btn"
              className="bg-[#3C77F7] px-4 py-2 rounded-full text-[20px] font-medium w-[80%] cursor-pointer text-center leading-tight mt-3"
            >
              Upload an Image and Verify
            </label>
          </div>
          <div className="flex justify-center">{content}</div>
        </div>
      </div>
    );
  } else if (success) {
    return (
      <div
        className="w-[100vw] h-[100vh] bg-black absolute z-30 flex justify-center items-center"
        style={{ background: "rgba(0, 0, 0, 0.4)" }}
      >
        <div
          className="w-[410px] h-[462px] p-8 flex flex-col justify-center items-center"
          style={{
            borderRadius: 26,
            background: "rgba(255, 255, 255, 0.40)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h1 className="text-[64px] font-bold">Location and Image Verified</h1>
          <p
            className="text-[20px] cursor-pointer"
            onClick={() => {
              setSuccess(false);
              onClickX();
              setIsDone(false);
            }}
          >
            close
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="absolute bottom-10 left-[357px] z-10 w-[403px] h-[193px] rounded-[26px] px-6 py-3"
        style={{
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(3px)",
        }}
      >
        <img
          src="/icon/x-circle.svg"
          alt="search"
          className="w-6 h-6 absolute right-2 mt-2 cursor-pointer"
          onClick={onClickX}
        />
        <img
          src="/icon/check-circle.svg"
          alt="search"
          className="w-6 h-6 absolute right-2 mt-9 cursor-pointer"
          onClick={handleCheckClick}
        />
        <h1
          className="text-[24px] font-bold"
          style={{ color: "rgba(255, 255, 255, 0.70)" }}
        >
          {/* max 15 characters */}
          {miniBoxData.eventName.length > 18
            ? miniBoxData.eventName.slice(0, 18) + "..."
            : miniBoxData.eventName}
        </h1>
        <h2
          className="text-[20px] -mt-[5px]"
          style={{ color: "rgba(255, 255, 255, 0.60)" }}
        >
          {miniBoxData.address}
        </h2>
        <div className="flex flex-col gap-2 mt-2">
          <div
            className="flex flex-row text-[20px] items-center gap-[11px]"
            style={{ color: "rgba(255, 255, 255, 0.40)" }}
          >
            <img src="/icon/clock.svg" alt="clock" className="w-6 h-6" />
            {miniBoxData.time}
          </div>
          <div
            className="flex flex-row text-[20px]  gap-[11px]  leading-[110%]"
            style={{ color: "rgba(255, 255, 255, 0.40)" }}
          >
            <img src="/icon/sparkles.svg" alt="sparkle" className="w-6 h-6" />
            {miniBoxData.description}
          </div>
        </div>
      </div>
    );
  }
};

export default MiniEventBox;
