import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import ROUTES from "@/constants/routes";
import { UserWithMeta } from "@/database/user.model";
import { getUserById } from "@/lib/actions/user.action";

const EditProfile = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect(ROUTES.SIGN_IN);

  const result = await getUserById({ userId });
  if (!result.success) redirect(ROUTES.SIGN_IN);

  console.log(result);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <ProfileForm user={result.data?.user as UserWithMeta} />
    </>
  );
};

export default EditProfile;
