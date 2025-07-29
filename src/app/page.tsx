import { Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features } from "@/data/features";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <main>
        <section className="relative pt-32 pb-24 text-center overflow-hidden bg-gradient-to-br from-primary to-[#c77700]">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="inline-flex items-center bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="font-bold mr-1.5 bg-primary text-primary-foreground w-4 h-4 text-center leading-4 rounded-sm"></span>
              Boosted by Genesis Academy
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-primary-foreground">
              Honey, Your Music is
              <br />
              Perfectly Managed
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-lg text-primary-foreground/90">
              Genesis Front-End School // Managing music tracks
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/tracks">
                <Button size="lg" className="gap-2">
                  <Rocket className="h-4 w-4" />
                  Launch Music Manager
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn more
              </Button>
            </div>
          </div>
        </section>

        <section className="relative z-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mt-[-44px] md:mt-[-56px] rounded-xl shadow-2xl">
              <Image
                src="/music-manager.png"
                alt="Music Manager App Screenshot"
                width={1200}
                height={700}
                className="rounded-lg mx-auto"
                quality={100}
                priority
              />
            </div>
          </div>
        </section>

        <section id="features" className="py-24 sm:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Powerful Features</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Everything you need to manage your music collection effectively
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
