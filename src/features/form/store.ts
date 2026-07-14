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

export function useFormStore({ startFresh = false }: { startFresh?: boolean } = {}) {
  const [initialDraft] = useState(() => (startFresh ? null : loadDraft()));
  const [formData, setFormData] = useState<FormData>(() => ({
    ...defaultFormValues,
    ...(initialDraft?.data || {}),
  }));
  const [currentStep, setCurrentStep] = useState(() => initialDraft?.currentStep ?? 0);
  const isLoaded = true;
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // A deliberate `?new=1` entry is a new creation session. Only external
  // persistence is touched here; the React state already starts from defaults.
  useEffect(() => {
    if (!startFresh) return;
    clearDraft();
    sessionStorage.removeItem('gs-greeting-submission');
    sessionStorage.removeItem('gs-greeting-result');
    window.history.replaceState(null, '', '/create');
  }, [startFresh]);

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

  // Return the current snapshot. The caller clears only after safely placing it
  // in sessionStorage, so a failed navigation never destroys the user's work.
  const submitForm = useCallback(() => {
    return formData;
  }, [formData]);

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
