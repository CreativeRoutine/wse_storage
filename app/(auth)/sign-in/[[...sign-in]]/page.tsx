import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="flex-center w-full h-screen bg-dark-100">
        <SignIn />
      </div>
    </>
  );
}
