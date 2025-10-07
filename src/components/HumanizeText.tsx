import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
export const HumanizeText = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [style, setStyle] = useState("standard");
  const [isLoading, setIsLoading] = useState(false);
  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to humanize");
      return;
    }
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("humanize-text", {
        body: {
          text: inputText,
          style
        }
      });
      if (error) throw error;
      if (data?.humanizedText) {
        setOutputText(data.humanizedText);
        toast.success("Text humanized successfully!");
      } else {
        throw new Error("No humanized text received");
      }
    } catch (error: any) {
      console.error("Error humanizing text:", error);
      toast.error(error.message || "Failed to humanize text");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-4xl text-slate-50 font-light text-center">AI to Human Text Converter</h2>
        <p className="text-muted-foreground font-thin">Transform AI-generated text into natural, human-like writing</p>
      </div>

      <Card className="p-6 space-y-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="space-y-3">
          <label className="text-foreground text-xl font-extralight">Writing Style</label>
          <ToggleGroup type="single" value={style} onValueChange={(value) => value && setStyle(value)} className="justify-start flex-wrap gap-2">
            <ToggleGroupItem value="standard" className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Standard
            </ToggleGroupItem>
            <ToggleGroupItem value="academic" className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Academic
            </ToggleGroupItem>
            <ToggleGroupItem value="simple" className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Simple
            </ToggleGroupItem>
            <ToggleGroupItem value="formal" className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Formal
            </ToggleGroupItem>
            <ToggleGroupItem value="informal" className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Informal
            </ToggleGroupItem>
            <ToggleGroupItem value="expand" className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Expand
            </ToggleGroupItem>
            <ToggleGroupItem value="shorten" className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Shorten
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-foreground text-xl font-thin">Input Text</label>
            <Textarea placeholder="Paste your AI-generated text here..." value={inputText} onChange={e => setInputText(e.target.value)} className="min-h-[300px] resize-none rounded-3xl bg-black" />
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-xl font-extralight">Humanized Output</label>
            <Textarea placeholder="Your humanized text will appear here..." value={outputText} readOnly className="min-h-[300px] resize-none bg-background rounded-3xl" />
          </div>
        </div>

        <Button onClick={handleHumanize} disabled={isLoading || !inputText.trim()} size="lg" className="w-full md:w-auto font-light rounded-lg text-black">
          {isLoading ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Humanizing...
            </> : "Humanize Text"}
        </Button>
      </Card>
    </div>;
};