import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { 
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Copy,
  Download, 
  Edit, 
  ExternalLink,
  Heart, 
  Loader2,
  Mail, 
  Phone, 
  Plus, 
  Save, 
  Settings, 
  Share,
  Star,
  Trash2, 
  XCircle} from 'lucide-react';

import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes. Built with Radix UI Slot for composition.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'candy'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'When true, the button will be rendered as a child element using Radix UI Slot',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the button',
    },
  },
  args: {
    children: 'Button',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;


export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

export const Candy: Story = {
  args: {
    variant: 'candy',
    children: 'Candy Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'A special candy variant with gradient background and fancy hover effects.',
      },
    },
  },
};


export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Icon: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Settings />,
  },
};


export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2 className="animate-spin" />
        Loading...
      </>
    ),
  },
};


export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Download />
        Download
      </>
    ),
  },
};

export const WithIconRight: Story = {
  args: {
    children: (
      <>
        Open
        <ExternalLink />
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Heart />,
  },
};


export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="candy">Candy</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants displayed together for comparison.',
      },
    },
  },
};


export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="outline">
        <Plus />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes displayed together for comparison.',
      },
    },
  },
};


export const ActionButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="default">
        <Save />
        Save
      </Button>
      <Button variant="outline">
        <Edit />
        Edit
      </Button>
      <Button variant="destructive">
        <Trash2 />
        Delete
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common action buttons with icons for typical CRUD operations.',
      },
    },
  },
};

export const SocialButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">
        <Heart />
        Like
      </Button>
      <Button variant="outline">
        <Share />
        Share
      </Button>
      <Button variant="outline">
        <Copy />
        Copy
      </Button>
      <Button variant="outline">
        <Star />
        Favorite
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Social interaction buttons with icons.',
      },
    },
  },
};

export const ContactButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="default">
        <Mail />
        Email
      </Button>
      <Button variant="secondary">
        <Phone />
        Call
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Contact action buttons for communication.',
      },
    },
  },
};

export const StatusButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="default">
        <CheckCircle />
        Success
      </Button>
      <Button variant="destructive">
        <XCircle />
        Error
      </Button>
      <Button variant="outline">
        <AlertCircle />
        Warning
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status indicator buttons with appropriate colors and icons.',
      },
    },
  },
};


export const DisabledVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled variant="default">Default</Button>
      <Button disabled variant="destructive">Destructive</Button>
      <Button disabled variant="outline">Outline</Button>
      <Button disabled variant="secondary">Secondary</Button>
      <Button disabled variant="ghost">Ghost</Button>
      <Button disabled variant="link">Link</Button>
      <Button disabled variant="candy">Candy</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants in their disabled state.',
      },
    },
  },
};


export const AsChild: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button asChild>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Link as Button
          <ExternalLink />
        </a>
      </Button>
      <Button asChild variant="outline">
        <a href="mailto:example@example.com">
          <Mail />
          Email Link
        </a>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Using the asChild prop to render buttons as other elements like links.',
      },
    },
  },
};


export const DropdownStyle: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">
        Options
        <ChevronDown />
      </Button>
      <Button variant="secondary">
        More Actions
        <ChevronDown />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons styled to look like dropdown triggers.',
      },
    },
  },
};


export const ComplexContent: Story = {
  render: () => (
    <div className="space-y-4">
      <Button size="lg" className="h-auto py-4 px-6">
        <div className="flex flex-col items-center gap-1">
          <Download className="size-6" />
          <span className="text-sm font-semibold">Download</span>
          <span className="text-xs opacity-75">Version 2.1.0</span>
        </div>
      </Button>
      
      <Button variant="outline" className="h-auto py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Star className="size-4 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-medium">Premium Plan</div>
            <div className="text-xs text-muted-foreground">$19/month</div>
          </div>
        </div>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with complex content including multiple text elements and custom layouts.',
      },
    },
  },
};


export const ResponsiveShowcase: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <Button className="w-full">Full Width Button</Button>
      <div className="flex gap-2">
        <Button className="flex-1">Flex 1</Button>
        <Button className="flex-1">Flex 1</Button>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1">Equal</Button>
        <Button className="flex-1">Width</Button>
        <Button className="flex-1">Buttons</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive button layouts with full width and flex arrangements.',
      },
    },
  },
};


export const DarkModeShowcase: Story = {
  render: () => (
    <div className="p-6 bg-slate-900 rounded-lg">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="candy">Candy</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Button variants displayed on a dark background to showcase dark mode styling.',
      },
    },
  },
};