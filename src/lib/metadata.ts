import type { Metadata } from "next";

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icons?: Metadata["icons"];
  noIndex?: boolean;
}

function constructMetadata({
  title,
  description = "Organize sua vida com simplicidade: controle financeiro, investimentos e agenda em um só lugar com o Peach Organizer.",
  image = "/og-image.png",
  icons = {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const baseTitle = "Peach Organizer";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  return {
    title: title
      ? {
          default: fullTitle,
          template: `%s | ${baseTitle}`,
        }
      : {
          default: baseTitle,
          template: `%s | ${baseTitle}`,
        },
    description,
    keywords: [
      "organizador pessoal",
      "finanças pessoais",
      "controle financeiro",
      "investimentos",
      "agenda",
      "produtividade",
      "organização pessoal",
      "gestão de tarefas",
    ],
    authors: [{ name: "Igor Garcia" }],
    creator: "Igor Garcia",
    applicationName: baseTitle,
    metadataBase: new URL("https://peachorganizer.com"),
    openGraph: {
      title: title ? fullTitle : "Peach Organizer - Sua vida organizada em um só lugar",
      description: title
        ? description
        : "Controle suas finanças, acompanhe investimentos e organize sua rotina com facilidade.",
      url: "https://peachorganizer.com",
      siteName: baseTitle,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Peach Organizer Preview",
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title ? fullTitle : baseTitle,
      description: title ? description : "Finanças, investimentos e agenda em um só app.",
      images: [image],
      creator: "@seuuser",
    },
    icons,
    manifest: "/site.webmanifest",
    category: "productivity",
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates: {
      canonical: "https://peachorganizer.com",
    },
  };
}

export { constructMetadata };
