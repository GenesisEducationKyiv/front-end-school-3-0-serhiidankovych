import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeartIcon, MoreHorizontalIcon,PlayIcon } from "lucide-react";

import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This is a basic card component</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  ),
};

export const MusicTrackCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Summer Vibes</CardTitle>
        <CardDescription>DJ Harmony • 128 BPM • 03:45</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Button variant="outline" size="sm">
          <PlayIcon className="mr-2 h-4 w-4" />
          Play Preview
        </Button>
        <Button variant="ghost" size="icon">
          <HeartIcon className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  ),
};

export const MusicAlbumCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="border-b">
        <CardTitle>Chill Beats 2023</CardTitle>
        <CardDescription>Various Artists • 24 tracks</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium">Summer Vibes</p>
            <p className="text-sm text-muted-foreground">DJ Harmony • 03:45</p>
          </div>
          <Button variant="ghost" size="icon">
            <PlayIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium">Midnight Groove</p>
            <p className="text-sm text-muted-foreground">Luna Sound • 04:12</p>
          </div>
          <Button variant="ghost" size="icon">
            <PlayIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="link" className="text-primary">
          + Add to playlist
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const MusicUploadCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Upload New Track</CardTitle>
        <CardDescription>Fill in the details for your new music track</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="track-title">Track Title</label>
          <Input id="track-title" placeholder="Enter track title" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="artist">Artist</label>
          <Input id="artist" placeholder="Enter artist name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="bpm">BPM</label>
            <Input id="bpm" type="number" placeholder="BPM" min="60" max="300" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="duration">Duration</label>
            <Input id="duration" placeholder="MM:SS" pattern="[0-9]{2}:[0-9]{2}" />
          </div>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="genre">Genre</label>
          <Input id="genre" placeholder="Enter genre" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Upload Track</Button>
      </CardFooter>
    </Card>
  ),
};

export const DarkThemeCard: Story = {
  parameters: {
    themes: {
      themeOverride: "dark", 
    },
  },
  render: () => (
    <div className="dark bg-background p-6">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Dark Theme Track</CardTitle>
          <CardDescription>Midnight Groove • 122 BPM • 04:12</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Button variant="outline" size="sm">
            <PlayIcon className="mr-2 h-4 w-4" />
            Play Preview
          </Button>
          <Button variant="ghost" size="icon">
            <HeartIcon className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

export const PlaylistCard: Story = {
  render: () => (
    <Card className="w-[300px] hover:shadow-md transition-shadow">
      <CardHeader className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background rounded-t-xl" />
        <div className="relative z-10">
          <CardTitle>My Summer Mix</CardTitle>
          <CardDescription>12 tracks • 48 minutes</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 grid gap-2 pt-4">
        <Button>
          <PlayIcon className="mr-2 h-4 w-4" />
          Play All
        </Button>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Last updated: Today
      </CardFooter>
    </Card>
  ),
};