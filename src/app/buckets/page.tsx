import { AppShell } from "@/components/layout/app-shell";
import { BucketCard } from "@/components/minto/bucket-card";
import { buckets } from "@/lib/mock-data";

export default function BucketsPage() {
  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-medium text-muted">Apartados</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[0] text-ink">
          Dinero con un propósito
        </h1>
      </section>

      {buckets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {buckets.map((bucket) => (
            <BucketCard key={bucket.id} bucket={bucket} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted">
          Aún no hay apartados.
        </p>
      )}
    </AppShell>
  );
}
