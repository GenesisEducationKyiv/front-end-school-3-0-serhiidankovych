import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Progress,ProgressPrimitive  } from "./progress";



const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "The progress value (0-100)",
    },
    className: {
      control: "text",
      description: "Additional class names to apply",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const ZeroProgress: Story = {
  args: {
    value: 0,
  },
};

export const FullProgress: Story = {
  args: {
    value: 100,
  },
};

export const CustomColor: Story = {
  args: {
    value: 75,
    className: "bg-emerald-500", 
  },
  render: (args) => (
    <Progress {...args}>
     <ProgressPrimitive.Indicator className="bg-emerald-500" />
    </Progress>
  ),
};

export const DifferentHeight: Story = {
  args: {
    value: 50,
    className: "h-4", 
  },
};

export const Animated: Story = {
  args: {
    value: 75,
    className: "transition-all duration-1000", 
  },
};