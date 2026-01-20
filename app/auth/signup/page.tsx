import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-primary-main/10 to-secondary-main/10 pt-20">
      <div className="w-full max-w-md p-8">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl rounded-2xl",
            },
          }}
          routing="path"
          path="/auth/signup"
          signInUrl="/auth/login"
        />
      </div>
    </div>
  );
}
