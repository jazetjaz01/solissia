import Image from "next/image";
import { HomeSlider } from "@/components/home-slider";

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
        <div className="relative mx-auto flex h-full max-w-(--breakpoint-2xl) items-center justify-center px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-center text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Votre intermédiaire import-export, du fournisseur à la livraison
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-5xl text-center text-xl leading-relaxed text-black sm:text-4xl font-semibold ">
          Solissia recherche, négocie et sécurise vos achats et vos ventes à
          l&apos;international.
        </p>
        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-center text-lg leading-relaxed text-muted-foreground">
          <p>
            Acheter et vendre à l&apos;étranger, c&apos;est jongler avec
            l&apos;inconnu : identifier un fournisseur ou un client fiable,
            valider son existence et vérifier si l&apos;opportunité business
            est réelle.
          </p>
          <p>
            Solissia prend ces démarches en charge. Nous pilotons ces étapes
            pour vous, tandis que vous conservez le pouvoir de décision à chaque
            étape clé.
          </p>
        </div>
      </section>
      <HomeSlider />
      <section className="mx-auto grid max-w-(--breakpoint-2xl) items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-[3fr_2fr] lg:gap-16 lg:px-8">
        <div className="relative h-64 sm:h-80 md:h-[480px]">
          <Image
            src="/images/home/home1.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-center text-2xl font-semibold leading-tight text-black sm:text-4xl">
            Solissia est expert en sourcing
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-amber-300" />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-black/80">
            <p>
              Nos équipes Achat et Qualité unissent leurs forces pour
              sélectionner des partenaires d&apos;excellence. Notre objectif :
              garantir des récoltes irréprochables tout en respectant des
              critères stricts de responsabilité environnementale et sociale.
            </p>
            <p>
              Pour dénicher les meilleurs fruits, nous explorons le monde
              entier. Lorsque les ingrédients nécessaires à nos formulations ne
              poussent pas en France, Solissia s&apos;approvisionne là où les
              conditions climatiques et culturales sont optimales, tout en
              soutenant l&apos;économie locale.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
