import { getStylesForPageData } from "@chaibuilder/sdk/lib";
import { get } from "lodash";
import { StylesAndFonts } from "./StylesAndFonts";
import { notFound } from "next/navigation";
import { chaiBuilder } from "@/app/chaiBuilder";
import "@/data-providers/default";
import "@/chai-blocks";
import "@/app/globals.css";
import { prepareExternalData } from "@chaibuilder/sdk/server";
import { RenderChaiPage } from "@chaibuilder/sdk/render";

interface ChaiParams {
  params: { slug: string[] };
}

const pageSlug = (params: ChaiParams["params"]) => join(params?.slug, "/");

export const generateViewport = async ({ params }: ChaiParams) => {
  const { data: pageData } = await chaiBuilder.getPageData(pageSlug(params));
  return {
    themeColor: get(
      pageData,
      "project.brandingOptions.primaryColor",
      "#000000"
    ) as string,
  };
};

export async function generateMetadata({ params }: ChaiParams) {
  const { data: pageData } = await chaiBuilder.getPageData(pageSlug(params));
  return {
    title: get(pageData, "page.seoData.title", ""),
    description: get(pageData, "page.seoData.description", ""),
    openGraph: {
      title: get(pageData, "page.seoData.title", ""),
      description: get(pageData, "page.seoData.description", ""),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: get(pageData, "page.seoData.title", ""),
      description: get(pageData, "page.seoData.description", ""),
      images: [get(pageData, "page.seoData.image", "")],
    },
    metadataBase: new URL("https://chaibuilder.com"),
  };
}

export default async function Home({ params: { slug } }: ChaiParams) {
  const { data } = await chaiBuilder.getPageData(`${slug?.join("/") || ""}`);
  if (!data) return notFound();

  // @ts-ignore
  const { data: externalData } = await prepareExternalData(data.page.providers);
  const styles = await getStylesForPageData(data);

  return (
    <RenderChaiPage
      externalData={externalData}
      pageData={data}
      before={<StylesAndFonts project={data.project} styles={styles} />}
    />
  );
}
