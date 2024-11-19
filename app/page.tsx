import type { Metadata } from "next";
import Counter from "@/app/components/counter/Counter";
import { Exercise } from "./components/exercise/Exercise";
import { Disco } from "./components/disco/Disco";

export default function IndexPage() {
  return <div>
    {/* <Exercise /> */}
    <Disco />
  </div>
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
