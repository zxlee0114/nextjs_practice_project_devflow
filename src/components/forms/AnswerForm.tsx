"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createAnwser } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { AnswerFormSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

type AnswerFormProps = {
  questionId: string;
  questionTitle: string;
  questionContent: string;
};

const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: AnswerFormProps) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const session = useSession();

  const form = useForm<z.infer<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: {
      content: "",
    },
  });
  const handleSubmit = async (value: z.infer<typeof AnswerFormSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnwser({ questionId, content: value.content });

      if (result.success) {
        form.reset();

        toast.success("Success", {
          description: "Your answer has posted successfully",
        });

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast.error("Error", {
          description:
            result.error?.message ||
            "Something went wrong. Please try again later",
        });
      }
    });
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast.info("Please log in", {
        description: "You need to be logged in to use this feature",
      });
    }

    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const result = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!result.success) {
        return toast.error("Error", {
          description: result.error?.message ?? "Something went wrong",
        });
      }

      if (result.data) {
        const formattedAnswer = result.data
          .replace(/<br>/g, " ")
          .toString()
          .trim();

        if (editorRef.current) {
          editorRef.current.setMarkdown(formattedAnswer);

          form.setValue("content", formattedAnswer);
          form.trigger("content");
        }
      }

      toast.success("Success", {
        description: "AI generated answer has been generated",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "There was a problem with your request",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md border px-4 py-2.5 shadow-none"
          disabled
          // disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src={"/icons/stars.svg"}
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl>
                  <Editor
                    value={field.value}
                    fieldChange={field.onChange}
                    editorRef={editorRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit cursor-pointer"
            >
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
