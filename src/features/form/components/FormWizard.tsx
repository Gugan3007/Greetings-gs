'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send, Loader2, CircleAlert } from 'lucide-react';
import { useState } from 'react';

import { useFormStore } from '../store';
import { FORM_STEPS } from '../steps';
import { FormStepRenderer } from './FormStep';
import { ProgressBar } from './ProgressBar';
import { RippleButton } from '@/components/motion/RippleButton';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration, ease } from '@/lib/motion';

/**
 * FormWizard — orchestrates the multi-step form experience.
 * One question group per screen with animated transitions.
 */
export function FormWizard() {
  const [startFresh] = useState(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('new') === '1'
  );
  const store = useFormStore({ startFresh });
  const prefersReduced = useReducedMotion();
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const currentStepConfig = FORM_STEPS[store.currentStep];

  const getStepErrors = (stepIndex: number) => {
    const result = store.validate();
    if (result.success) return {};

    const stepFields = new Set(FORM_STEPS[stepIndex].fields.map((field) => field.key));
    return Object.fromEntries(
      result.error.issues
        .filter((issue) => stepFields.has(issue.path[0] as keyof typeof store.formData))
        .map((issue) => [String(issue.path[0]), issue.message])
    );
  };

  const handleNext = () => {
    setDirection(1);
    if (store.isLastStep) {
      handleSubmit();
    } else {
      const stepErrors = getStepErrors(store.currentStep);
      if (Object.keys(stepErrors).length > 0) {
        setValidationErrors(stepErrors);
        return;
      }
      setValidationErrors({});
      store.nextStep();
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setValidationErrors({});
    store.prevStep();
  };

  const handleSubmit = async () => {
    const result = store.validate();
    if (!result.success) {
      const firstInvalidKey = result.error.issues[0]?.path[0];
      const firstInvalidStep = FORM_STEPS.findIndex((step) =>
        step.fields.some((field) => field.key === firstInvalidKey)
      );

      if (firstInvalidStep >= 0) {
        setDirection(firstInvalidStep < store.currentStep ? -1 : 1);
        setValidationErrors(getStepErrors(firstInvalidStep));
        store.goToStep(firstInvalidStep);
      } else {
        setValidationErrors({ form: 'Please review the form and complete the required fields.' });
      }
      return;
    }

    setIsSubmitting(true);
    const data = store.submitForm();

    // Navigate to processing page with data
    // For now, store in sessionStorage and redirect
    try {
      sessionStorage.setItem('gs-greeting-submission', JSON.stringify(data));
      store.resetForm();
      window.location.href = '/processing';
    } catch {
      setIsSubmitting(false);
    }
  };

  if (!store.isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
      </div>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      filter: 'blur(4px)',
    }),
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-glass-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-3 items-center px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-fg-secondary transition-colors hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <span className="text-center text-sm font-medium text-fg-secondary">
            Step {store.currentStep + 1} of {store.totalSteps}
          </span>

          <div />
        </div>
        <ProgressBar progress={store.progress} accentColor={currentStepConfig.accentColor} />
      </header>

      {/* ─── Step Content ────────────────────────────────────────── */}
      <main className="flex w-full flex-1 items-start justify-center px-4 pt-8 pb-32 sm:px-6 md:pt-16 md:pb-40">
        <div className="form-wizard-frame mx-auto rounded-[2rem] border border-glass-border bg-white/[0.018]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={store.currentStep}
              custom={direction}
              variants={prefersReduced ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: prefersReduced ? 0 : duration.normal,
                ease: ease.outExpo as [number, number, number, number],
              }}
            >
              {/* Step header */}
              <div className="mb-10 text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)]"
                  style={{ background: `${currentStepConfig.accentColor}20` }}
                >
                  <currentStepConfig.icon
                    className="h-6 w-6"
                    style={{ color: currentStepConfig.accentColor }}
                  />
                </div>
                <h1
                  className="mb-2 text-3xl font-bold sm:text-4xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {currentStepConfig.title}
                </h1>
                <p className="text-fg-secondary text-lg">
                  {currentStepConfig.subtitle}
                </p>
              </div>

              {/* Fields */}
              <FormStepRenderer
                step={currentStepConfig}
                formData={store.formData}
                updateField={store.updateField}
              />

              {Object.keys(validationErrors).length > 0 && (
                <motion.div
                  role="alert"
                  aria-live="assertive"
                  className="mt-8 rounded-[var(--radius-md)] border border-accent-rose/35 bg-accent-rose/10 p-4 text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-2 flex items-center justify-center gap-2 font-semibold text-accent-rose">
                    <CircleAlert className="h-4 w-4" />
                    Please complete this step
                  </div>
                  <ul className="space-y-1 text-sm text-fg-secondary">
                    {Object.entries(validationErrors).map(([fieldKey, message]) => {
                      const field = currentStepConfig.fields.find((item) => item.key === fieldKey);
                      return <li key={fieldKey}>{field?.label || 'Form'}: {message}</li>;
                    })}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ─── Navigation Footer ───────────────────────────────────── */}
      <footer className="sticky bottom-0 border-t border-glass-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 py-4">
          <RippleButton
            variant="ghost"
            onClick={handlePrev}
            disabled={store.isFirstStep}
            aria-label="Previous step"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </RippleButton>

          <div className="text-center">{store.isDirty && (
            <motion.span
              className="text-xs text-fg-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Draft saving...
            </motion.span>
          )}</div>

          {store.isLastStep ? (
            <MagneticButton
              className="rounded-[var(--radius-lg)] bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 font-semibold text-white shadow-lg shadow-accent-purple/20"
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-label="Generate greeting"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Greeting
                </>
              )}
            </MagneticButton>
          ) : (
            <RippleButton className="justify-self-end" variant="primary" onClick={handleNext} aria-label="Next step">
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </RippleButton>
          )}
        </div>
      </footer>
    </div>
  );
}
