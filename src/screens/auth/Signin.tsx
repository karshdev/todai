"use client";
import GoogleIcon from "@/assets/img/google.svg";
import TodaiLogo from "@/assets/img/todailogobig.png";
import OrLine from "@/components/OrLine";
import { TodaiButton } from "@/components/TodaiButton";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiInput from "@/components/TodaiInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInSchema, SignInSchemaType } from "./types/signin";
import { ErrorMessage } from "./types/signup";
import { useState } from "react";
import { TodaiAlertDialog } from "@/components/TodaiAlertDialog";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function Signin() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaType>({ resolver: zodResolver(SignInSchema) });
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    console.log(process.env.NEXTAUTH_URL, "NEXTAUTH_URL _----->");
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
    });

    if (!response?.error) {
      // router.push(response?.url || 'http://localhost:3000/')
      // router.refresh()
    } else {
      setShowAlert(true);
      setAlertDescription("Incorrect Email/Password");
      setAlertTitle("Login failed");
    }
  };

  return (
    <div className="p-8 md:p-18 lg:p-28 flex flex-col justify-center items-center w-full h-full">
      <TodaiAlertDialog
        open={showAlert}
        setOpen={setShowAlert}
        //okCallBack={okCallBack}
        title={alertTitle}
        description={alertDescription}
        buttonTitle="Ok"
      />
      <div className="w-full flex flex-col gap-4 ">
        <TodaiImage
          src={TodaiLogo}
          className="self-center h-10 w-44"
          width={450}
          height={500}
          alt="logo"
        />
        <h2 className="text-4xl font-bold ">{`It's time to use todai. Let's go...`}</h2>
        <h3 className="text-lg font-semibold">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up.
          </a>
        </h3>
        <form
          className="flex flex-col gap-3 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TodaiInput
            label="Email"
            type="email"
            placeholder="johnwick@mail.com"
            name="email"
            inputMode="text"
            extra="flex-1"
            inputClass="!p-6 bg-slate-200"
            register={register("email")}
            errorMessage={errors.email as ErrorMessage}
          />
          <TodaiInput
            label="Password"
            type="password"
            placeholder="Password"
            name="password"
            inputMode="text"
            extra="flex-1"
            inputClass="!p-6 bg-slate-200"
            register={register("password")}
            errorMessage={errors.password as ErrorMessage}
          />
          {/* <button className='bg-blue-500 p-5 rounded-md text-white'>Sign up your account</button> */}
          <TodaiButton
            type="submit"
            className="relative w-full !py-5 text-center flex justify-center text-white"
            variant="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Sign in
          </TodaiButton>
        </form>
      </div>
      <OrLine text="or sign in with" />
      <div className="w-full mt-5">
        <button className="border p-5 w-full rounded-md font-semibold">
          <div
            className="flex gap-3 justify-center items-center"
            onClick={() =>
              signIn("google", {
                callbackUrl: `${process.env.NEXTAUTH_URL}/?type=signin`,
              })
            }
          >
            <Image src={GoogleIcon} alt="authBg" className="h-5 w-5" />
            <span> Sign in with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Signin;
