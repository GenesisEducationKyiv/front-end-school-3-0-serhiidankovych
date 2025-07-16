import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

import ActiveTrackDisplay from "@/features/tracks/components/ui/active-track";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center md:justify-between gap-4 h-36 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 whitespace-nowrap">
          <ActiveTrackDisplay />
        </div>

        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 whitespace-nowrap">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Serhii Dankovych
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/serhiidankovych"
            aria-label="GitHub profile"
            target="_blank"
          >
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>

          <Link href="mailto:serhiidankovych@gmail.com" aria-label="Email">
            <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/serhii-dankovych-706642255/"
            aria-label="LinkedIn profile"
            target="_blank"
          >
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
