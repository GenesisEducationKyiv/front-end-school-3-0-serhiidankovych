import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "search", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
    className: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Search tracks...",
  },
};

export const TrackTitleInput: Story = {
  args: {
    placeholder: "Enter track title...",
    defaultValue: "Summer Vibes",
  },
};

export const ArtistNameInput: Story = {
  args: {
    placeholder: "Enter artist name...",
    defaultValue: "DJ Harmony",
  },
};

export const BPMInput: Story = {
  args: {
    type: "number",
    placeholder: "Enter BPM...",
    defaultValue: "128",
    min: "60",
    max: "300",
  },
};

export const DurationInput: Story = {
  args: {
    type: "text",
    placeholder: "MM:SS",
    defaultValue: "03:45",
    pattern: "[0-9]{2}:[0-9]{2}",
  },
};

export const GenreInput: Story = {
  args: {
    placeholder: "Enter genre...",
    defaultValue: "House",
  },
};

export const AlbumSearch: Story = {
  args: {
    type: "search",
    placeholder: "Search albums...",
  },
};

export const MusicUploadForm: Story = {
  render: (args) => (
    <div className="grid w-full max-w-md gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="track-title">Track Title</label>
        <Input {...args} id="track-title" placeholder="Enter track title" />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="artist">Artist</label>
        <Input {...args} id="artist" placeholder="Enter artist name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="bpm">BPM</label>
          <Input {...args} id="bpm" type="number" placeholder="BPM" min="60" max="300" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="duration">Duration</label>
          <Input {...args} id="duration" placeholder="MM:SS" pattern="[0-9]{2}:[0-9]{2}" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="genre">Genre</label>
        <Input {...args} id="genre" placeholder="Enter genre" />
      </div>
    </div>
  ),
};

export const InvalidTrackInput: Story = {
  args: {
    "aria-invalid": true,
    placeholder: "Track title",
    defaultValue: "Summer Vibes!@#",
    className: "border-destructive",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows how the input appears when invalid characters are entered for a track title.",
      },
    },
  },
};