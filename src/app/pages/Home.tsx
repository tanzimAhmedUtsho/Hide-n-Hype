import { Hero } from "../components/Hero";
import { MarqueeBanner } from "../components/MarqueeBanner";
import { Categories } from "../components/Categories";
import { Newsletter } from "../components/Newsletter";

export function Home() {
  return (
    <>
      <Hero />
      <MarqueeBanner />
      <Categories />
      <Newsletter />
    </>
  );
}
