import { getOptimizelyClient } from "./optimizely";

const COMPONENT_FIELDS = `
  _metadata { types displayName key }
  ... on HeadingElement { headingText }
  ... on ParagraphElement { text { html } }
  ... on CTAElement { Text Link { default } }
  ... on ImageElement { altText imageLink { url { default } } }
  ... on RichTextElement { text { html } }
  ... on VideoElement { title video { url { default } } placeholder { url { default } } }
  ... on ButtonBlock { ButtonText ButtonUrl { default } ButtonVariant }
  ... on ArticleListElement { articleListCount topics }
  ... on OdpEmbedBlock { ContentId }
  ... on HeroBlock {
    Heading SubHeading Eyebrow HeroColor
    HeroImage { url { default } }
    Description { html }
    HeroButton { ButtonText ButtonUrl { default } ButtonVariant }
  }
  ... on CarouselBlock {
    CarouselItemsContentArea {
      _metadata { types displayName }
      ... on QuoteBlock {
        QuoteText QuoteProfileName QuoteProfileLocation
        QuoteProfilePicture { url { default } }
      }
    }
  }
`;

const EXPERIENCE_QUERY = `
  _metadata {
    key displayName types
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
              ... on CompositionStructureNode {
                nodes {
                  key type nodeType displayName
                  displaySettings { key value }
                  ... on CompositionComponentNode {
                    component { ${COMPONENT_FIELDS} }
                  }
                }
              }
              ... on CompositionComponentNode {
                component { ${COMPONENT_FIELDS} }
              }
            }
          }
          ... on CompositionComponentNode {
            component { ${COMPONENT_FIELDS} }
          }
        }
      }
      ... on CompositionComponentNode {
        component { ${COMPONENT_FIELDS} }
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
      items { ${EXPERIENCE_QUERY} }
    }
  }`;

  const result = await client.request(query, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = (result as any)?.BlankExperience?.items?.[0];
  if (item) return item;

  const blogQuery = `{
    BlogSectionExperience(
      where: { _metadata: { url: { default: { eq: "${path}" } } } }
      limit: 1
    ) {
      items { ${EXPERIENCE_QUERY} }
    }
  }`;

  const blogResult = await client.request(blogQuery, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (blogResult as any)?.BlogSectionExperience?.items?.[0] ?? null;
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
