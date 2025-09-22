"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useRef, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";
import { Question } from "@/types/global";

import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

type QuestionFormValues = z.infer<typeof AskQuestionSchema>;

type QuestionFormParams = {
  question?: Question;
  isEdit?: boolean;
};

const QuestionForm = ({ question, isEdit = false }: QuestionFormParams) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  const defaultValues: QuestionFormValues = {
    title: question?.title || "",
    content: question?.content || "",
    tags: question?.tags.map((tag) => tag.name) || [],
  };

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues,
  });

  const handleCreateQuestion: SubmitHandler<QuestionFormValues> = async (
    data
  ) => {
    startTransition(async () => {
      if (isEdit && question) {
        const result = await editQuestion({
          questionId: question._id,
          ...data,
        });
        if (result.success) {
          toast.success("Success", {
            description: "Question updated successfully",
          });
          if (result.data)
            router.push(DYNAMIC_ROUTES.QUESTION_DETAIL(result.data._id));
        } else {
          toast.error(`Error: ${result.status}`, {
            description: result.error?.message || "Something went wrong...",
          });
        }

        return;
      }

      const result = await createQuestion(data);

      if (result.success) {
        toast.success("Success", {
          description: "Question created successfully",
        });
        if (result.data)
          router.push(DYNAMIC_ROUTES.QUESTION_DETAIL(result.data._id));
      } else {
        toast.error(`Error: ${result.status}`, {
          description: result.error?.message || "Something went wrong...",
        });
      }
    });
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const tagInput = e.currentTarget.value.trim();
    const tags = form.getValues("tags") as string[];

    if (!validateTagInput(tags, tagInput)) return;

    form.setValue("tags", [...tags, tagInput]);
    e.currentTarget.value = "";
    form.clearErrors("tags");
  };

  const validateTagInput = (currentTags: string[], tagInput: string) => {
    if (!tagInput) return false;

    if (currentTags.length >= 5) {
      form.setError("tags", {
        type: "manual",
        message: "You can add up to 5 tags",
      });
      return false;
    }

    if (tagInput.length > 15) {
      form.setError("tags", {
        type: "manual",
        message: "Tag should be less than 15 characters",
      });
      return false;
    }

    const formattedInput = tagInput.toLowerCase();
    if (currentTags.some((tag) => tag.toLowerCase() === formattedInput)) {
      form.setError("tags", {
        type: "manual",
        message: "Tag already exists",
      });
      return false;
    }
    return true;
  };

  const handleTagRemove = (tagToRemove: string) => {
    const tags = form.getValues("tags") as string[];
    const newTags = tags.filter((tag) => tag !== tagToRemove);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem.{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  value={field.value}
                  fieldChange={field.onChange}
                  editorRef={editorRef}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => {
            return (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Add tags..."
                      onKeyDown={handleTagKeyDown}
                      className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                        {field.value.map((tag) => (
                          <TagCard
                            key={tag}
                            _id={tag}
                            name={tag}
                            isCompact
                            isRemovable
                            isButton
                            handleRemove={() => handleTagRemove(tag)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="body-regular text-light-500 mt-2.5">
                  Add up to 5 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient !text-light-900 w-fit"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>{!isEdit ? "Ask A Question" : "Edit"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
