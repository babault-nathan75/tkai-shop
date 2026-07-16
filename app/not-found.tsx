import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-14 text-center text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">
        404
      </p>
      <h1 className="mt-4 text-5xl font-black md:text-7xl">Page introuvable</h1>
      <p className="mt-4 max-w-md text-zinc-400">
        La page que tu cherches n&rsquo;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-primary px-7 py-4 font-black text-white shadow-glow transition hover:bg-accent"
        >
          Retour à l&rsquo;accueil
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-white/10 px-7 py-4 font-bold transition hover:border-primary"
        >
          Explorer la boutique
        </Link>
      </div>
    </section>
  );
}
