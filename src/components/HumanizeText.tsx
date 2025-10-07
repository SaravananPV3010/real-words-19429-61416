import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <div className="space-y-2">
          <label className="text-foreground font-extralight text-4xl">Writing Style</label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-full md:w-[250px] text-base font-thin">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (Natural)</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="informal">Informal</SelectItem>
              <SelectItem value="expand">Expand</SelectItem>
              <SelectItem value="shorten">Shorten</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-foreground text-xl font-thin">Input Text</label>
            <ScrollArea className="h-[300px] rounded-3xl border border-input bg-black">
              <Textarea placeholder="Paste your AI-generated text here..." value={inputText} onChange={e => setInputText(e.target.value)} className="min-h-[300px] resize-none rounded-3xl bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-xl font-extralight">Humanized Output</label>
            <ScrollArea className="h-[300px] rounded-3xl border border-input bg-background">
              <Textarea placeholder="Your humanized text will appear here..." value={outputText} readOnly className="min-h-[300px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
            </ScrollArea>
          </div>
        </div>

        <Button onClick={handleHumanize} disabled={isLoading || !inputText.trim()} size="lg" className="w-full md:w-auto font-light rounded-lg text-black bg-white">
          {isLoading ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Humanizing...
            </> : "Humanize Text"}
        </Button>
      </Card>
    </div>;
};