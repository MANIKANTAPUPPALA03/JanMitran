'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AIAssistantProps {
  onDraft: (draft: string) => void;
}

const sampleDrafts = [
  "There is significant garbage accumulation at the corner of Main Street and Oak Avenue. The waste bins have not been emptied for several days, creating an unsightly situation and potential health hazard.",
  "The streetlight near my residence has been non-functional for over a week, creating safety concerns during evening hours. Please prioritize repair.",
  "Water supply interruption in Sector 5 has persisted for 3 days. Many households lack essential water for daily needs. Urgent resolution required.",
];

export function AIAssistant({ onDraft }: AIAssistantProps) {
  const [draft, setDraft] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDraft = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomDraft = sampleDrafts[Math.floor(Math.random() * sampleDrafts.length)];
      setDraft(randomDraft);
      setIsGenerating(false);
    }, 800);
  };

  const useDraft = () => {
    if (draft) {
      onDraft(draft);
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader>
        <CardTitle>AI Complaint Assistant</CardTitle>
        <CardDescription>Let AI help draft your complaint</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Button 
          onClick={generateDraft} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Draft Complaint'}
        </Button>

        {draft && (
          <div className="flex-1 flex flex-col gap-3">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Your AI-generated draft will appear here..."
              className="flex-1 resize-none"
            />
            <Button onClick={useDraft} variant="secondary" className="w-full">
              Use This Draft
            </Button>
          </div>
        )}

        {!draft && (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
            <p className="text-sm">Click "Draft Complaint" to generate a sample complaint text</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
