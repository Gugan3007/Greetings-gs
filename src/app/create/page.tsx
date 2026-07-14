'use client';

import dynamic from 'next/dynamic';

// Lazy-load the FormWizard since it's a heavy client component
const FormWizard = dynamic(
  () =>
    import('@/features/form/components/FormWizard').then((m) => ({
      default: m.FormWizard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-purple border-t-transparent" />
      </div>
    ),
  }
);

export default function CreatePage() {
  return <FormWizard />;
}
