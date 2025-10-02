"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type ActionButtonsProps = {
  type: "question" | "answer";
  targetId: string;
};

const ActionButtons = ({ type, targetId }: ActionButtonsProps) => {
  const router = useRouter();

  const handleEdit = () => {
    // navigate to edit page
    router.push(`/questions/${targetId}/edit`);
  };

  const handleDelete = () => {
    if (type === "question") {
      return toast.success("Question deleted", {
        description: "Your question has been deleted successfully.",
      });
    }
    if (type === "answer") {
      return toast.success("Answer deleted", {
        description: "Your answer has been deleted successfully.",
      });
    }
  };
  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "answer" && "justify-center gap-0"}`}
    >
      {type === "question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image src="/icons/trash.svg" alt="trash" width={14} height={14} />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "question" ? "question" : "answer"} and remove it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!border-primary-100 !bg-primary-500 !text-light-800"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionButtons;
