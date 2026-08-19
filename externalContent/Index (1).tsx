import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContractTypeSelector } from '@/components/ContractTypeSelector';
import { ContractForm } from '@/components/ContractForm';
import { ContractPreview } from '@/components/ContractPreview';
import { AIContractGenerator } from '@/components/AIContractGenerator';
import { Button } from '@/components/ui/button';
import { type ContractType } from '@/lib/contracts';
import { ArrowRight, Scale, ChevronLeft, Sparkles, FileText } from 'lucide-react';

type Mode = 'template' | 'ai';
type Step = 'select' | 'form' | 'preview';

const Index = () => {
  const [mode, setMode] = useState<Mode>('template');
  const [step, setStep] = useState<Step>('select');
  const [selectedType, setSelectedType] = useState<ContractType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleTypeSelect = (type: ContractType) => {
    setSelectedType(type);
    setFormData({});
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') setStep('select');
    if (step === 'preview') setStep('form');
  };

  return (
    <div className="min-h-screen bg-background font-body flex flex-col" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground">יוצר החוזים</h1>
              <p className="text-xs text-muted-foreground">משרד עו״ד אלון אלישע</p>
            </div>
          </div>
          {mode === 'template' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={step === 'select' ? 'text-primary font-medium' : ''}>בחירה</span>
              <ChevronLeft className="w-4 h-4" />
              <span className={step === 'form' ? 'text-primary font-medium' : ''}>מילוי פרטים</span>
              <ChevronLeft className="w-4 h-4" />
              <span className={step === 'preview' ? 'text-primary font-medium' : ''}>תצוגה מקדימה</span>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-5xl mx-auto px-4 py-10 flex-1">
        {/* Mode switcher */}
        <div className="flex justify-center gap-3 mb-10">
          <Button
            variant={mode === 'template' ? 'gold' : 'secondary'}
            size="lg"
            onClick={() => { setMode('template'); setStep('select'); }}
            className="gap-2"
          >
            <FileText className="w-5 h-5" />
            חוזה מתבנית
          </Button>
          <Button
            variant={mode === 'ai' ? 'gold' : 'secondary'}
            size="lg"
            onClick={() => setMode('ai')}
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            חוזה עם AI
          </Button>
        </div>

        {mode === 'ai' && <AIContractGenerator />}

        {mode === 'template' && (
          <>
            {step !== 'select' && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowRight className="w-4 h-4" />
                חזרה
              </button>
            )}

            {step === 'select' && (
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    בחר את סוג <span className="text-primary">החוזה</span>
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    בחר את סוג החוזה שאתה צריך ומלא את הפרטים. המערכת תייצר עבורך חוזה מקצועי.
                  </p>
                </div>
                <ContractTypeSelector selected={selectedType} onSelect={handleTypeSelect} />
              </div>
            )}

            {step === 'form' && selectedType && (
              <div className="space-y-6">
                <ContractForm type={selectedType} data={formData} onChange={setFormData} />
                <div className="flex justify-start">
                  <Button variant="gold" size="lg" onClick={() => setStep('preview')}>
                    צפה בחוזה
                  </Button>
                </div>
              </div>
            )}

            {step === 'preview' && selectedType && (
              <ContractPreview type={selectedType} data={formData} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6">
        <div className="container max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} משרד עו״ד אלון אלישע. כל הזכויות שמורות.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">מדיניות פרטיות</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">תקנון</Link>
            <a href="https://elisha-law.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">elisha-law.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
