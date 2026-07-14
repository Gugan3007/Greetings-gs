'use client';

import { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Upload, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type FormData, type TimelineMilestone } from '../schema';
import { type FormStep, type FormField } from '../steps';

interface FormStepRendererProps {
  step: FormStep;
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}

/**
 * Renders all fields for a given form step.
 * Handles text, textarea, select, option-cards, date, timeline, photos, checkbox.
 */
export function FormStepRenderer({ step, formData, updateField }: FormStepRendererProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      {step.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={formData[field.key]}
          onChange={(val) => updateField(field.key, val as FormData[typeof field.key])}
          accentColor={step.accentColor}
        />
      ))}
    </div>
  );
}

// ─── Field Renderer ──────────────────────────────────────────────────────────

interface FieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  accentColor: string;
}

function FieldRenderer({ field, value, onChange, accentColor }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
      return <TextField field={field} value={value as string} onChange={onChange} />;
    case 'textarea':
      return <TextareaField field={field} value={value as string} onChange={onChange} />;
    case 'date':
      return <DateField field={field} value={value as string} onChange={onChange} />;
    case 'option-cards':
      return (
        <OptionCardsField
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case 'timeline':
      return (
        <TimelineField
          value={value as TimelineMilestone[]}
          onChange={onChange}
          accentColor={accentColor}
        />
      );
    case 'photos':
      return <PhotosField value={value as string[]} onChange={onChange} />;
    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={value as boolean}
          onChange={onChange}
        />
      );
    default:
      return <TextField field={field} value={value as string} onChange={onChange} />;
  }
}

// ─── Text Input ──────────────────────────────────────────────────────────────

function TextField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2 text-center">
      <label className="block text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="ml-1 text-accent-rose">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        className={cn(
          'w-full rounded-[var(--radius-md)] border border-glass-border bg-glass-bg px-4 py-3',
          'text-center text-foreground placeholder:text-fg-muted',
          'transition-all duration-200',
          'focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple/50',
          'hover:border-[rgba(255,255,255,0.15)]'
        )}
      />
      {field.helperText && (
        <p className="text-xs text-fg-muted">{field.helperText}</p>
      )}
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────

function TextareaField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
}) {
  const charCount = (value || '').length;
  const maxLen = field.maxLength || 1000;

  return (
    <div className="space-y-2 text-center">
      <label className="block text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="ml-1 text-accent-rose">*</span>}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        maxLength={maxLen}
        rows={field.key === 'personalLetter' ? 8 : 4}
        className={cn(
          'w-full resize-none rounded-[var(--radius-md)] border border-glass-border bg-glass-bg px-4 py-3',
          'text-center text-foreground placeholder:text-fg-muted',
          'transition-all duration-200',
          'focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple/50',
          'hover:border-[rgba(255,255,255,0.15)]'
        )}
      />
      <div className="flex items-center justify-center gap-4">
        {field.helperText && (
          <p className="text-xs text-fg-muted">{field.helperText}</p>
        )}
        <p
          className={cn(
            'text-xs',
            charCount > maxLen * 0.9 ? 'text-accent-rose' : 'text-fg-muted'
          )}
        >
          {charCount}/{maxLen}
        </p>
      </div>
    </div>
  );
}

// ─── Date Input ──────────────────────────────────────────────────────────────

function DateField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2 text-center">
      <label className="block text-sm font-medium text-foreground">
        {field.label}
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-glass-border bg-glass-bg pl-10 pr-4 py-3',
            'text-foreground',
            'transition-all duration-200',
            'focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple/50',
            '[color-scheme:dark]'
          )}
        />
      </div>
    </div>
  );
}

// ─── Option Cards ────────────────────────────────────────────────────────────

function OptionCardsField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = field.options || [];

  return (
    <div className="space-y-3 text-center">
      <label className="block text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="ml-1 text-accent-rose">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'relative flex flex-col items-center gap-1 rounded-[var(--radius-md)] border p-4',
                'text-center transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-accent-purple bg-accent-purple/10 text-foreground'
                  : 'border-glass-border bg-glass-bg text-fg-secondary hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)]'
              )}
              whileTap={{ scale: 0.97 }}
            >
              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-purple"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
              <span className="font-medium text-sm">{opt.label}</span>
              {opt.description && (
                <span className="text-xs text-fg-muted">{opt.description}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Timeline Milestones ─────────────────────────────────────────────────────

function TimelineField({
  value,
  onChange,
  accentColor,
}: {
  value: TimelineMilestone[];
  onChange: (v: TimelineMilestone[]) => void;
  accentColor: string;
}) {
  const milestones = value || [];

  const addMilestone = () => {
    if (milestones.length >= 12) return;
    onChange([...milestones, { date: '', caption: '' }]);
  };

  const updateMilestone = (index: number, field: keyof TimelineMilestone, val: string) => {
    const updated = milestones.map((m, i) =>
      i === index ? { ...m, [field]: val } : m
    );
    onChange(updated);
  };

  const removeMilestone = (index: number) => {
    onChange(milestones.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {/* Removed redundant label and description since they are handled by the Step Header */}

      <AnimatePresence mode="popLayout">
        {milestones.map((milestone, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 rounded-[var(--radius-md)] border border-glass-border bg-glass-bg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            layout
          >
            {/* Timeline dot */}
            <div
              className="mt-3 h-3 w-3 flex-shrink-0 rounded-full"
              style={{ background: accentColor }}
            />

            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:gap-4">
              <input
                type="date"
                value={milestone.date}
                onChange={(e) => updateMilestone(i, 'date', e.target.value)}
                className="w-full rounded-[var(--radius-sm)] border border-glass-border bg-background px-3 py-2 text-sm text-foreground sm:w-40 [color-scheme:dark]"
                placeholder="Date"
              />
              <input
                type="text"
                value={milestone.caption}
                onChange={(e) => updateMilestone(i, 'caption', e.target.value)}
                placeholder="What happened? e.g. 'We met at the coffee shop'"
                maxLength={200}
                className="flex-1 rounded-[var(--radius-sm)] border border-glass-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-fg-muted"
              />
            </div>

            <button
              type="button"
              onClick={() => removeMilestone(i)}
              className="mt-2 sm:mt-0 text-fg-muted transition-colors hover:text-accent-rose self-start sm:self-center ml-2"
              aria-label="Remove milestone"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {milestones.length < 12 && (
        <button
          type="button"
          onClick={addMilestone}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-glass-border py-3 text-sm text-fg-secondary transition-colors hover:border-accent-purple hover:text-accent-purple"
        >
          <Plus className="h-4 w-4" />
          Add Milestone
        </button>
      )}
    </div>
  );
}

// ─── Photos Upload ───────────────────────────────────────────────────────────

function PhotosField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photos = value;

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (photos.length + files.length > 20) {
        alert('Maximum 20 photos allowed');
        return;
      }

      // Convert to data URLs for preview (will be uploaded to storage later)
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result as string;
          onChange([...photos, url]);
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [photos, onChange]
  );

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">Photos</label>
      <p className="text-xs text-fg-muted">
        Upload up to 20 photos. Square or portrait orientation work best.
      </p>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {photos.map((photo, i) => (
              <motion.div
                key={`photo-${i}`}
                className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-glass-border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Upload ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Remove photo ${i + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload button */}
      {photos.length < 20 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-glass-border py-8 text-fg-secondary transition-colors hover:border-accent-purple hover:text-accent-purple"
        >
          <Upload className="h-8 w-8" />
          <span className="text-sm font-medium">Click to upload photos</span>
          <span className="text-xs text-fg-muted">
            {photos.length}/20 photos • JPG, PNG, WebP
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function CheckboxField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-glass-border bg-glass-bg p-4 transition-colors hover:border-[rgba(255,255,255,0.15)]">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-[4px] border-2 transition-all duration-200',
            value
              ? 'border-accent-purple bg-accent-purple'
              : 'border-fg-muted bg-transparent'
          )}
        >
          <AnimatePresence>
            {value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <span className="text-sm text-fg-secondary leading-relaxed">
        {field.label}
        {field.required && <span className="ml-1 text-accent-rose">*</span>}
      </span>
    </label>
  );
}
