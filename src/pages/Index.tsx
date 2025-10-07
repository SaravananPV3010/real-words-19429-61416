import TargetCursor from "@/components/TargetCursor";
import { GridBackground } from "@/components/GridBackground";
import { ParticleField } from "@/components/ParticleField";
import { InteractiveText } from "@/components/InteractiveText";
import { HumanizeText } from "@/components/HumanizeText";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GridBackground />
      <ParticleField />
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-8 py-16">
        <div className="max-w-4xl text-center space-y-12 mb-16">
          <h1 className="text-6xl md:text-8xl font-bold">
            <InteractiveText>Interactive Experience</InteractiveText>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground">
            <InteractiveText>
              Move your cursor to see the magic
            </InteractiveText>
          </p>

          <div className="pt-8 space-y-4">
            <p className="text-lg">
              <InteractiveText>
                Hover over the text to magnify characters
              </InteractiveText>
            </p>
            <p className="text-lg">
              <InteractiveText>
                Watch particles scatter as you move
              </InteractiveText>
            </p>
          </div>
        </div>

        <HumanizeText />
      </div>
    </div>
  );
};

export default Index;
