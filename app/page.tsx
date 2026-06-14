"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Spinner,
} from "@heroui/react";
import React, { useEffect } from "react";

export default function Home() {
  const [loadingArticles, setLoadingArticles] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [articles, setArticles] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [catalogs, setCatalogs] = React.useState<any[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = React.useState(false);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // Response langsung berupa array articles
      setArticles(Array.isArray(data) ? data : data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchCatalogs = async () => {
    setLoadingCatalogs(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/design-catalogs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // Response langsung berupa array catalogs
      setCatalogs(Array.isArray(data) ? data : data.projects || []);
      console.log("Fetched catalogs:", Array.isArray(data) ? data : data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingCatalogs(false);
    }
  };

  useEffect(() => {
   
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles();
    fetchCatalogs();
  }, []);

  // Format tanggal dari ISO string ke format yang lebih readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Potong teks untuk excerpt
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* ========== NAVBAR ========== */}
      <Navbar
        isBordered
        className="bg-black/80 backdrop-blur-md p-8 border-zinc-800 sticky top-0 z-50"
        maxWidth="xl"
      >
        <NavbarBrand>
          <Image
            removeWrapper
            alt="Jubetor Logo"
            className="w-20 h-20 rounded-full object-cover"
            src="/jubetor_logo.jpg"
          />
          {/* <p className="font-bold text-xl ml-3 tracking-tight text-white">
            JUBETOR
          </p> */}
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-6 font-bold" justify="center">
          <NavbarItem>
            <Link href="#" className="text-zinc-300 hover:text-white transition">
              Beranda
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#projects" className="text-zinc-300 hover:text-white transition">
              Katalog
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#articles" className="text-zinc-300 hover:text-white transition">
              Artikel
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#about" className="text-zinc-300 hover:text-white transition">
              Tentang Kami
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={Link}
              href="#contact"
              variant="shadow"
              className="bg-red-600 p-4 hover:bg-red-700 text-white font-semibold"
              size="sm"
            >
              Hubungi Kami
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* ========== HERO SECTION ========== */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 max-w-4xl mx-auto">
        <p className="text-red-500 tracking-widest text-sm mb-4 font-medium uppercase">
          Custom Motorcycle Garage
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Wujudkan Motor Impian <br />
          <span className="text-red-500">Tanpa Batas</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mb-10">
          Kami membangun motor custom dengan presisi tinggi dan karakter unik.
          Dari scrambler, cafe racer, hingga tracker — semua dibuat sesuai jiwa Anda.
        </p>
        {/* <div className="flex gap-4 flex-wrap justify-center">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8"
            variant="shadow"
            as={Link}
            href="#projects"
          >
            Lihat Katalog
          </Button>
          <Button
            size="lg"
            variant="bordered"
            className="border-zinc-600 text-zinc-300 hover:text-white hover:border-white px-8"
          >
            Konsultasi Gratis
          </Button>
        </div> */}
      </section>

      {/* ========== KATALOG PROJEK ========== */}
      <section id="projects" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-500 text-sm uppercase tracking-widest font-medium">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Katalog Projek
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
            Setiap motor kami kerjakan dengan detail tinggi, menjadikannya karya seni yang siap dikendarai.
          </p>
        </div>

        {loadingCatalogs ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="danger" />
          </div>
        ) : catalogs.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">
            <p>Belum ada katalog projek.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogs.map((catalog) => (
              <Card
                key={catalog.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all duration-300"
                isPressable
              >
                <CardHeader className="p-0">
                  <Image
                    removeWrapper
                    alt={catalog.name}
                    className="w-full object-cover h-56 rounded-t-xl"
                    src={catalog.image}
                  />
                </CardHeader>
                <CardBody className="p-5">
                  <h3 className="text-xl font-bold">{catalog.name}</h3>
                  <p className="text-zinc-400 mt-2 text-sm line-clamp-2">
                    {catalog.description}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        catalog.isAvailable === "true"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {catalog.isAvailable === "true" ? "Tersedia" : "Tidak Tersedia"}
                    </span>
                  </div>
                </CardBody>
                <CardFooter className="px-5 pb-5 pt-0">
                  {/* <Button
                    size="sm"
                    variant="light"
                    className="text-red-500 hover:text-red-400 p-0"
                  >
                    Lihat Detail →
                  </Button> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ========== ARTIKEL ========== */}
      <section id="articles" className="px-6 py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-sm uppercase tracking-widest font-medium">
              Blog & Tips
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">Artikel Terbaru</h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Dapatkan inspirasi, tips modifikasi, dan cerita di balik setiap build.
            </p>
          </div>

          {loadingArticles ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" color="danger" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              <p>Belum ada artikel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all duration-300"
                  isPressable
                >
                  <CardHeader className="p-0">
                    <Image
                      removeWrapper
                      alt={article.title}
                      className="w-full object-cover h-48 rounded-t-xl"
                      src={article.thumbnail}
                    />
                  </CardHeader>
                  <CardBody className="p-5">
                    <p className="text-xs text-zinc-500 mb-2">
                      {formatDate(article.createdAt)}
                    </p>
                    <h3 className="text-lg font-bold leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 line-clamp-3">
                      {truncateText(article.content, 120)}
                    </p>
                  </CardBody>
                  <CardFooter className="px-5 pb-5 pt-0">
                    {/* <Button
                      size="sm"
                      variant="light"
                      className="text-red-500 hover:text-red-400 p-0"
                    >
                      Baca Selengkapnya →
                    </Button> */}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== TENTANG KAMI ========== */}
      <section id="about" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-red-500 text-sm uppercase tracking-widest font-medium">
              Tentang Kami
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
              Lebih dari Sekadar Bengkel
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              JUBETOR INDONESIA lahir dari passion terhadap dunia roda dua. Kami tidak hanya
              memodifikasi motor, tapi menciptakan karakter yang mewakili pemiliknya.
              Dengan pengalaman lebih dari 10 tahun, kami telah menangani ratusan proyek
              dari berbagai genre.
            </p>
            <Divider className="my-6 bg-zinc-800" />
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-bold text-red-500">200+</p>
                <p className="text-sm text-zinc-400">Motor Selesai</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">10+</p>
                <p className="text-sm text-zinc-400">Tahun Pengalaman</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">15</p>
                <p className="text-sm text-zinc-400">Penghargaan</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              removeWrapper
              alt="Garage Custom Workshop"
              className="w-full h-auto rounded-2xl border border-zinc-800"
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80"
            />
            {/* <div className="absolute -bottom-6 -left-6 bg-red-600 text-white p-4 rounded-xl hidden md:block">
              <p className="text-sm font-medium">🏆 Best Custom Build 2024</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-zinc-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © 2025 JUBETOR INDONESIA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-400 hover:text-white text-sm">
              Instagram
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white text-sm">
              YouTube
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white text-sm">
              WhatsApp
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}