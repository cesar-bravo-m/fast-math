import type { Metadata } from "next";
import Counter from "@/app/components/counter/Counter";
import { Exercise } from "./components/exercise/Exercise";
import { Disco } from "./components/disco/Disco";
import { DiscoBackground } from "./components/disco/DiscoBackground";

export default function IndexPage() {
  return <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    {/* <Exercise /> */}
    <DiscoBackground />
    <Disco />
  </div>
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
