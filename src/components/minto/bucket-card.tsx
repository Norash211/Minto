import { formatMoney, percentOf } from "@/lib/money";
import type { Bucket } from "@/types/finance";

type BucketCardProps = {
  bucket: Bucket;
};

export function BucketCard({ bucket }: BucketCardProps) {
  const progress = bucket.target ? percentOf(bucket.balance, bucket.target) : 100;

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-ink">{bucket.name}</h3>
          <p className="mt-1 text-sm leading-5 text-muted">{bucket.description}</p>
        </div>
        <span className="rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-medium text-secondary">
          {bucket.committed ? "Comprometido" : "Flexible"}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold tracking-[0] text-ink">
            {formatMoney(bucket.balance)}
          </p>
          {bucket.target ? (
            <p className="text-sm text-muted">Meta {formatMoney(bucket.target)}</p>
          ) : null}
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-savings"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </article>
  );
}
