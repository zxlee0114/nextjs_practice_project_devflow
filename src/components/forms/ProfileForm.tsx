"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { UserWithMeta } from "@/database/user.model";
import { updateUser } from "@/lib/actions/user.action";
import { updateUserSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type ProfileFormProps = {
  user: UserWithMeta;
};

const ProfileForm = ({ user }: ProfileFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { _id, name, username, portfolio, location, bio } = user;

  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: name || "",
      username: username || "",
      portfolio: portfolio || "",
      location: location || "",
      bio: bio || "",
    },
  });

  const handleUpdateProfile = async (
    values: z.infer<typeof updateUserSchema>
  ) => {
    startTransition(async () => {
      const result = await updateUser({ ...values });
      if (result.success) {
        toast.success("Success", {
          description: "Your profile has been updated successfully",
        });
        router.push(DYNAMIC_ROUTES.PROFILE_DETAIL(_id));
      } else {
        toast.error(`Error ${result.status}`, {
          description:
            result.error?.message ||
            "Something went wrong. Please try again later.",
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form
        className="mt-9 flex w-full flex-col gap-9"
        onSubmit={form.handleSubmit(handleUpdateProfile)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your Portfolio link"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Where do you live?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="What's special about you?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
