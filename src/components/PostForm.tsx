import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "./ui/textarea";
import { dash } from "radash";
import { api } from "~/utils/api";
import Link from "next/link";

const formSchema = z.object({
  author: z
    .string()
    .min(2, {
      message: "Author's name must be at least 2 characters.",
    })
    .max(200, {
      message: "Author's name must not exceed 200 characters.",
    }),
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(200, {
      message: "Title must not exceed 200 characters.",
    }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
});

function PostForm() {
  const { mutateAsync: createPost } = api.post.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      title: "",
      slug: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createPost({ ...values });
    form.reset();
  };

  // Only allow alphanumeric + spaces and remove trailing spaces. Format string to dash-case.
  const formatSlug = (val: string) => {
    const sanitizedVal = val.trim().replace(/[^a-zA-Z0-9\s]/g, "");
    form.setValue("slug", dash(sanitizedVal));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-x-8 gap-y-4"
      >
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Super Exciting Article" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="something-memorable-and-short"
                      {...field}
                      onBlur={(e) => formatSlug(e.currentTarget.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the URL to access the article.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2 md:col-span-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write about something..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2 flex w-full justify-end gap-4">
          <Link href="/">
            <Button type="button" variant="outline">
              Back to Blog
            </Button>
          </Link>
          <Button type="submit">Publish Post</Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
