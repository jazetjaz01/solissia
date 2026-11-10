import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative h-[60vh]">
        <Image
          src="/images/home/home1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex h-full max-w-(--breakpoint-xl) items-center px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Votre intermédiaire import-export, du fournisseur à la livraison
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-12 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Solissia recherche, négocie et sécurise vos achats et vos ventes à
          l&apos;international.
        </p>
      </section>
    </main>
  );
}
