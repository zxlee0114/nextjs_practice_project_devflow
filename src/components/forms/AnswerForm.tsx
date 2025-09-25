"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createAnwser } from "@/lib/actions/answer.action";
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

const AnswerForm = ({ questionId }: { questionId: string }) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);

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
      } else {
        toast.error("Error", {
          description:
            result.error?.message ||
            "Something went wrong. Please try again later",
        });
      }
    });
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md border px-4 py-2.5 shadow-none"
          disabled={isAISubmitting}
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
