import { ArrowLeft, Music } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-8 min-h-screen">
      <div className="text-center py-12">
        <div className="mb-6">
          <Music className="h-16 w-16 mx-auto text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Track Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          The track you&apos;re looking for doesn&apos;t exist, has been
          removed, or you don&apos;t have permission to view it.
        </p>
        <Button asChild>
          <Link href="/tracks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tracks
          </Link>
        </Button>
      </div>
    </div>
  );
}
