import HomePage from "@/components/HomePage/HomePage";
import NavBar from "@/components/NavBar/NavBar";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";

export default function Home() {
  return (
    <AnimationWrapper>
      <NavBar />
      <HomePage />
    </AnimationWrapper>
  );
}
