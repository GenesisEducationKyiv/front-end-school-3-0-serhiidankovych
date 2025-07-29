import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Form>;

const formSchema = z.object({
  artistName: z.string().min(2, {
    message: "Artist name must be at least 2 characters.",
  }),
  trackTitle: z.string().min(2, {
    message: "Track title must be at least 2 characters.",
  }),
});

export const Basic: Story = {
  render: () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        artistName: "",
        trackTitle: "",
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[400px]">
          <FormField
            control={form.control}
            name="artistName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Daft Punk" {...field} />
                </FormControl>
                <FormDescription>
                  Name displayed on your music profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trackTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Harder, Better, Faster, Stronger" {...field} />
                </FormControl>
                <FormDescription>
                  Title of the music track to manage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Connect</Button>
        </form>
      </Form>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        artistName: "A",
        trackTitle: "",
      },
    });

    form.handleSubmit(() => {})();

    return (
      <Form {...form}>
        <form className="space-y-8 w-[400px]">
          <FormField
            control={form.control}
            name="artistName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Daft Punk" {...field} />
                </FormControl>
                <FormDescription>
                  Name displayed on your music profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trackTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Harder, Better, Faster, Stronger" {...field} />
                </FormControl>
                <FormDescription>
                  Title of the music track to manage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Connect</Button>
        </form>
      </Form>
    );
  },
};
