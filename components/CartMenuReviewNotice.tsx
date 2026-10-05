import type { CartMenuChanges } from "@/components/CartProvider";

export default function CartMenuReviewNotice({
  changes,
}: {
  changes: CartMenuChanges | null;
}) {
  if (!changes) return null;

  const hasChanges =
    changes.priceChanges.length > 0 ||
    changes.renamedItems.length > 0 ||
    changes.unavailableItems.length > 0;
  if (!hasChanges) return null;

  return (
    <div
      role="status"
      className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950"
    >
      <p className="font-bold">
        The menu changed. Review your updated order and total before continuing.
      </p>
      {changes.priceChanges.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1">
          {changes.priceChanges.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              {item.name}: ₦{item.oldPrice.toLocaleString()} → ₦
              {item.newPrice.toLocaleString()}
            </li>
          ))}
        </ul>
      )}
      {changes.renamedItems.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1">
          {changes.renamedItems.map((item, index) => (
            <li key={`${item.oldName}-${index}`}>
              {item.oldName} is now {item.newName}.
            </li>
          ))}
        </ul>
      )}
      {changes.unavailableItems.length > 0 && (
        <p className="mt-2">
          Removed because they are unavailable: {changes.unavailableItems.join(", ")}.
        </p>
      )}
    </div>
  );
}
