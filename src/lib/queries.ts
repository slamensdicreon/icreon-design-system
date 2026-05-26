import { getOptimizelyClient } from "./optimizely";

const EXPERIENCE_FRAGMENT = `
  _metadata {
    key
    displayName
    types
    url { default }
  }
  composition {
    nodes {
      key type nodeType displayName
      displaySettings { key value }
      ... on CompositionStructureNode {
        nodes {
          key type nodeType displayName
          displaySettings { key value }
          ... on CompositionStructureNode {
            nodes {
              key type nodeType displayName
              displaySettings { key value }
              ... on CompositionComponentNode {
                component {
                  _metadata { types displayName }
                  ... on HeadingElement { headingText }
                  ... on ParagraphElement { text { html } }
                  ... on CTAElement { Text Link { default } }
                  ... on ImageElement { altText imageLink { url { default } } }
                  ... on RichTextElement { text { html } }
                  ... on VideoElement { title video { url { default } } placeholder { url { default } } }
                  ... on ButtonBlock { ButtonText ButtonUrl { default } ButtonVariant }
                  ... on ContentRecsElement { ElementDeliveryApiKey ElementRecommendationCount }
                }
              }
            }
          }
          ... on CompositionComponentNode {
            component {
              _metadata { types displayName }
              ... on HeadingElement { headingText }
              ... on ParagraphElement { text { html } }
              ... on CTAElement { Text Link { default } }
              ... on ImageElement { altText imageLink { url { default } } }
              ... on RichTextElement { text { html } }
              ... on VideoElement { title video { url { default } } placeholder { url { default } } }
              ... on ButtonBlock { ButtonText ButtonUrl { default } ButtonVariant }
            }
          }
        }
      }
      ... on CompositionComponentNode {
        component {
          _metadata { types displayName }
          ... on HeroBlock {
            Heading SubHeading Eyebrow HeroColor
            HeroImage { url { default } }
            Description { html }
            HeroButton { ButtonText ButtonUrl { default } ButtonVariant }
          }
          ... on CarouselBlock {
            CarouselItemsContentArea {
              _metadata { types displayName }
            }
          }
        }
      }
    }
  }
`;

export async function getExperienceByPath(path: string) {
  const client = getOptimizelyClient();
  const query = `{
    BlankExperience(
      where: { _metadata: { url: { default: { eq: "${path}" } } } }
      limit: 1
    ) {
      items {
        ${EXPERIENCE_FRAGMENT}
      }
    }
  }`;

  const result = await client.request(query, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result as any)?.BlankExperience?.items?.[0] ?? null;
}

export async function getContentByPath(path: string) {
  const client = getOptimizelyClient();
  return client.getContentByPath(path);
}

export async function getStartPage() {
  return getExperienceByPath("/en/");
}

export async function getBlogPosts(limit = 10) {
  const client = getOptimizelyClient();
  const query = `{
    BlogPostPage(limit: ${limit}, orderBy: { _modified: DESC }) {
      items {
        _metadata { key displayName url { default } }
        Heading
        ArticleSubHeading
        ArticleAuthor
        Topic
        BlogPostPromoImage { url { default } }
      }
    }
  }`;

  const result = await client.request(query, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result as any)?.BlogPostPage?.items ?? [];
}

export async function getExperiences(limit = 20) {
  const client = getOptimizelyClient();
  const query = `{
    BlankExperience(limit: ${limit}) {
      items {
        _metadata { key displayName url { default } }
      }
    }
  }`;

  const result = await client.request(query, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result as any)?.BlankExperience?.items ?? [];
}
