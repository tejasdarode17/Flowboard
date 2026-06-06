import { Loader2 } from "lucide-react";
import FlowBoardLogo from "../icons/FlowBoardLogo";

const MainLoder = () => {
  return (
    <div className=" h-screen gap-5 flex flex-col justify-center items-center">
      <FlowBoardLogo size={50}></FlowBoardLogo>
      <Loader2 className="animate-spin"></Loader2>
    </div>
  );
};

export default MainLoder;
