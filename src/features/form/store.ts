'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { type FormData, defaultFormValues, formSchema } from './schema';
import { TOTAL_STEPS } from './steps';

const STORAGE_KEY = 'gs-greetings-draft';
const AUTOSAVE_INTERVAL = 5000; // 5 seconds

// ─── IndexedDB Draft Persistence ─────────────────────────────────────────────

function saveDraft(data: Partial<FormData>, currentStep: number): void {
  try {
    const serialized = JSON.stringify({ data, currentStep, savedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Silent fail — localStorage might be full or unavailable
  }
}

function loadDraft(): { data: Partial<FormData>; currentStep: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { data: parsed.data, currentStep: parsed.currentStep ?? 0 };
  } catch {
    return null;
  }
}

function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silent fail
  }
}

// ─── Form Store Hook ─────────────────────────────────────────────────────────

export function useFormStore() {
  const [formData, setFormData] = useState<FormData>(defaultFormValues);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft?.data) {
      setFormData((prev) => ({ ...prev, ...draft.data }));
      setCurrentStep(draft.currentStep);
    }
    setIsLoaded(true);
  }, []);

  // Autosave every 5 seconds when dirty
  useEffect(() => {
    if (!isLoaded) return;

    autoSaveTimer.current = setInterval(() => {
      if (isDirty) {
        saveDraft(formData, currentStep);
        setIsDirty(false);
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [isLoaded, isDirty, formData, currentStep]);

  // Update a single field
  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  // Navigate between steps
  const goToStep = useCallback((step: number) => {
    const clamped = Math.max(0, Math.min(step, TOTAL_STEPS - 1));
    setCurrentStep(clamped);
    saveDraft(formData, clamped);
  }, [formData]);

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  // Validate entire form
  const validate = useCallback(() => {
    const result = formSchema.safeParse(formData);
    return result;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(defaultFormValues);
    setCurrentStep(0);
    clearDraft();
    setIsDirty(false);
  }, []);

  // Save and clear draft on submit
  const submitForm = useCallback(() => {
    saveDraft(formData, currentStep);
    return formData;
  }, [formData, currentStep]);

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return {
    formData,
    currentStep,
    isLoaded,
    isDirty,
    progress,
    isFirstStep,
    isLastStep,
    totalSteps: TOTAL_STEPS,
    updateField,
    updateFields,
    goToStep,
    nextStep,
    prevStep,
    validate,
    resetForm,
    submitForm,
    clearDraft,
  };
}
