import UserIdPage from "@/components/PageComponents/User/id/UserIdPage";

export async function generateStaticParams() {
  return [{}];
}

function page({ params }) {
  return <UserIdPage params={params} />;
}

export default page;
