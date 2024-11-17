import type { Metadata } from "next";
import Counter from "@/app/components/counter/Counter";
import { Exercise } from "./components/exercise/Exercise";

export default function IndexPage() {
  return <div>
    <Exercise />
  </div>
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
