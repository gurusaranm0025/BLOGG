import SignMethodPage from "@/components/PageComponents/Account/SignMethodPage";

function page({ params }) {
  return <SignMethodPage params={params} />;
}

export async function generateStaticParams() {
  return [{ signMethod: "signin" }, { signMethod: "signup" }];
}

export default page;
