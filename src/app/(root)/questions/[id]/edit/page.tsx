import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES, { DYNAMIC_ROUTES } from "@/constants/routes";
import { getQuestionById } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/global";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);

  const result = await getQuestionById({ questionId: id });
  if (!result.success) return notFound();
  if (result.data?.author.toString() !== session.user?.id)
    redirect(DYNAMIC_ROUTES.QUESTION_DETAIL(id));

  return (
    <>
      <main>
        <QuestionForm question={result.data} isEdit />
      </main>
    </>
  );
};

export default EditQuestion;
