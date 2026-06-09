import type { GetBucketsResult } from "@/server/queries";
import type { Bucket } from "@/types/finance";

function decimalToNumber(value: { toNumber(): number }) {
  return value.toNumber();
}

function getBucketDescription(bucket: GetBucketsResult[number]) {
  if (bucket.type === "EMERGENCY") {
    return "Fondo protegido para imprevistos";
  }

  if (bucket.type === "COMMITTED") {
    return "Dinero asignado para compromisos";
  }

  if (bucket.type === "GOAL") {
    return "Ahorro reservado para una meta";
  }

  if (bucket.type === "DEBT") {
    return "Dinero reservado para deudas";
  }

  if (bucket.type === "SUBSCRIPTION") {
    return "Pagos recurrentes apartados";
  }

  if (bucket.type === "CAREER") {
    return "Crecimiento profesional";
  }

  return "Disponible para decidir hoy";
}

export function toBucketsViewBuckets(buckets: GetBucketsResult): Bucket[] {
  return buckets.map((bucket) => ({
    id: bucket.id,
    name: bucket.name,
    description: getBucketDescription(bucket),
    balance: decimalToNumber(bucket.currentAmount),
    target: bucket.targetAmount ? decimalToNumber(bucket.targetAmount) : undefined,
    committed: bucket.type !== "FREE",
  }));
}
