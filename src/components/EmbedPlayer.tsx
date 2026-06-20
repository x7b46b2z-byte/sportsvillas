export function EmbedPlayer({ html }: { html: string | null }) {
  if (!html) {
    return (
      <div className="aspect-video w-full bg-navy rounded-2xl grid place-items-center text-zinc-400 text-sm">
        Stream not available yet
      </div>
    );
  }
  // Iframe content is provided by trusted admin. Sandbox iframes for safety.
  const sandboxed = html.includes("<iframe")
    ? html.replace(/<iframe([^>]*)>/g, '<iframe$1 sandbox="allow-same-origin allow-scripts allow-presentation allow-forms allow-popups" referrerpolicy="no-referrer">')
    : html;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-black/5 shadow-xl [&_iframe]:w-full [&_iframe]:h-full">
      {/* eslint-disable-next-line react/no-danger */}
      <div className="size-full" dangerouslySetInnerHTML={{ __html: sandboxed }} />
    </div>
  );
}
