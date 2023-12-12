import Logo from "@/components/Logo/Logo";
import Image from "next/image";
import maria from "@/public/maria_back.jpg";
import Input from "@/components/signMethod/Input";
import google from "@/public/google.svg";

function page({ params }) {
  return (
    <div className="flex h-full w-full">
      <Logo className="absolute mt-[10px] ml-[10px] md:mt-[1vh] md:ml-[2vw]" />
      <div className="w-full md:w-[45vw] h-full flex items-center justify-center md:items-start">
        <form
          action=""
          className="md:mt-[25vh] w-[80%] max-w-[400px] md:max-w-[450px]"
        >
          <h2 className="font-rale">
            {params.signMethod === "signin" ? "WELCOME" : "JOIN US TODAY!"}
          </h2>
          {params.signMethod === "signup" && (
            <Input
              type="text"
              placeholder="Username"
              name="username"
              id="username"
              icon="user"
            />
          )}
          <Input
            type="text"
            placeholder="Email"
            name="email"
            id="email"
            icon="email"
          />
          <Input
            type="password"
            placeholder="password"
            name="password"
            id="password"
            icon="key"
          />
          <button className="btn-dark center mt-12 py-3 hover:bg-gunmetal-2/60 hover:text-black outline-none hover:outline-french-gray duration-150">
            {params.signMethod == "signin" ? "Sign In" : "Sign Up"}
          </button>

          <div className="relative items-center flex w-full gap-2 my-10 opacity-30 uppercase text-black font-semibold font-montserrat">
            <hr className="w-1/2 border-black" />
            or
            <hr className="w-1/2 border-black" />
          </div>

          <button className="center outline-none hover:outline-french-gray hover:bg-gunmetal-2/60 duration-200 text-md font-poppins relative btn-dark w-[80%]">
            <Image
              src={google}
              className="w-[1.5rem] object-fill absolute bottom-0"
            />
            <span className="ml-9">Continue with Google</span>
          </button>

          {params.signMethod == "signin" ? (
            <p className="mt-8 text-center w-full text-black">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-gunmetal hover:underline duration-200 hover:text-black"
              >
                Join us today!
              </a>{" "}
            </p>
          ) : (
            <p className="mt-8 text-center w-full text-black">
              Already a user?{" "}
              <a
                href="/signup"
                className="text-gunmetal hover:underline duration-200 hover:text-black"
              >
                Sign In.
              </a>{" "}
            </p>
          )}
        </form>
      </div>
      <div className="hidden md:block md:w-[55vw] h-full">
        <Image src={maria} alt="maria flower image" />
      </div>
    </div>
  );
}

export default page;
