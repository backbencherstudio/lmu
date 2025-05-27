import Image from "next/image";
import Landingpage from "../app/(client)/client/_components/landingpage";
import Menu from "./(client)/client/_components/menu";
export default function Home() {
  return (
    <>
    
      <Menu />
      { <Landingpage /> }


    </>

  );
}
