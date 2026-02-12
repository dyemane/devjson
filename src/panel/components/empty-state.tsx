export function EmptyState() {
  return (
    <div class="empty-state">
      <div class="empty-state__icon">{ }</div>
      <p class="empty-state__title">No requests captured</p>
      <p class="empty-state__hint">
        Navigate to a page with JSON API calls and they'll appear here
      </p>
    </div>
  );
}
