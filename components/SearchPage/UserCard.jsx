import Link from "next/link";

function UserCard({ user }) {
  let {
    personal_info: { fullname, username, profile_img },
  } = user;

  return (
    <Link href={`/user/${username}`} className="flex gap-5 items-center mb-5">
      <img
        src={profile_img}
        className="w-14 h-14 rounded-full"
        alt="profile-img"
      />

      <div>
        <h1 className="font-medium text-lg line-clamp-2">{fullname}</h1>
        <p className="text-cadet-gray">@{username}</p>
      </div>
    </Link>
  );
}

export default UserCard;
