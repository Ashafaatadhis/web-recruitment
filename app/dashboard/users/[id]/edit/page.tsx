import { notFound } from "next/navigation";
import { getUserById } from "@/actions/user/user";
import EditUserForm from "./_components/edit-user-form";

export default async function EditUserPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const userData = await getUserById(params.id);

  if (!userData) {
    return notFound();
  }

  return <EditUserForm user={userData} />;
}
