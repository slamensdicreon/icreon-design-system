import { initReactComponentRegistry } from "@optimizely/cms-sdk/react/server";

import BlankSection from "@/components/blocks/BlankSection";
import HeadingElement from "@/components/elements/HeadingElement";
import ParagraphElement from "@/components/elements/ParagraphElement";
import CTAElement from "@/components/elements/CTAElement";
import ImageElement from "@/components/elements/ImageElement";
import RichTextElement from "@/components/elements/RichTextElement";
import VideoElement from "@/components/elements/VideoElement";
import ArticleListElement from "@/components/elements/ArticleListElement";
import HeroBlockComponent from "@/components/blocks/HeroBlock";
import ButtonBlock from "@/components/blocks/ButtonBlock";
import CardBlock from "@/components/blocks/CardBlock";
import TextBlock from "@/components/blocks/TextBlock";
import CTABlock from "@/components/blocks/CTABlock";
import CarouselBlock from "@/components/blocks/CarouselBlock";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import BlogPostPage from "@/components/blocks/BlogPostPage";
import OdpEmbedBlock from "@/components/blocks/OdpEmbedBlock";
import DefaultBlock from "@/components/blocks/DefaultBlock";

let registered = false;

export function registerComponents() {
  if (registered) return;

  initReactComponentRegistry({
    resolver: {
      BlankSection,
      HeadingElement,
      ParagraphElement,
      CTAElement,
      ImageElement,
      RichTextElement,
      VideoElement,
      ArticleListElement,
      HeroBlock: HeroBlockComponent,
      ButtonBlock,
      CardBlock,
      TextBlock,
      CTABlock,
      CarouselBlock,
      QuoteBlock,
      BlogPostPage,
      OdpEmbedBlock,
      _default: DefaultBlock,
    },
  });

  registered = true;
}
