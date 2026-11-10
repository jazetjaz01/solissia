import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex-1">
      <Image
        src="/images/home/home1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </main>
  );
}
