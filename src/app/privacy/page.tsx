export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-5xl">Privacy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/65">
        <p>
          Koreyaki uses this website to show the published menu, 3D dish previews, and a WhatsApp handoff for orders and
          reservations. We do not collect payment card numbers.
        </p>
        <p>
          Checkout and reservation forms send the details you type to the restaurant via WhatsApp and store a draft in
          our database so staff can see the request. Do not include information you do not want the restaurant to
          receive.
        </p>
        <p>
          The in-browser cart is stored on your device. The optional AI guide is grounded in the published menu. If an
          AI provider key is configured on the server, messages are sent to that provider with the same grounding
          rules.
        </p>
      </div>
    </main>
  );
}
