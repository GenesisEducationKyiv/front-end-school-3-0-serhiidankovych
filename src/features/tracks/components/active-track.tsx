'use client';

import { useEffect, useState } from 'react';
import { api } from "../api/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; 

export default function ActiveTrackDisplay() {
  const [activeTrack, setActiveTrack] = useState<string | null>('Connecting...');

  useEffect(() => {
    
    const unsubscribe = api.subscribeToActiveTrack((newTrackName) => {
      setActiveTrack(newTrackName);
    });

    return () => {
      unsubscribe();
    };
  }, []); 

  return (
    <Card className="w-full max-w-md mt-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Active Track
        </CardTitle>
        <CardDescription>
          This updates in real-time via Subscriptions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">Now Playing: </span>
          <span className="font-medium text-card-foreground">
            {activeTrack || 'No track is active'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}