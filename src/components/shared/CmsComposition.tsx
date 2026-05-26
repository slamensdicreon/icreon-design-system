import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";

interface CompositionNode {
  key: string;
  type: string | null;
  nodeType: string;
  displayName?: string;
  displaySettings?: Array<{ key: string; value: string }>;
  nodes?: CompositionNode[];
  component?: Record<string, unknown> & {
    _metadata?: { types?: string[]; displayName?: string };
  };
}

function RenderComponentNode({ node }: { node: CompositionNode }) {
  if (!node.component) return null;

  const typeName =
    node.type || node.component._metadata?.types?.[0] || "_Component";

  return (
    <OptimizelyComponent
      content={{
        ...node.component,
        __typename: typeName,
      }}
    />
  );
}

function RenderColumn({ node }: { node: CompositionNode }) {
  if (!node.nodes?.length) return <div style={{ flex: 1 }} />;

  return (
    <div style={{ flex: 1 }}>
      {node.nodes.map((child) => (
        <RenderNode key={child.key} node={child} />
      ))}
    </div>
  );
}

function RenderRow({ node }: { node: CompositionNode }) {
  if (!node.nodes?.length) return null;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      {node.nodes.map((col) => (
        <RenderColumn key={col.key} node={col} />
      ))}
    </div>
  );
}

function RenderSection({ node }: { node: CompositionNode }) {
  if (!node.nodes?.length) return null;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {node.nodes.map((child) => (
          <RenderNode key={child.key} node={child} />
        ))}
      </div>
    </section>
  );
}

function RenderNode({ node }: { node: CompositionNode }) {
  switch (node.nodeType) {
    case "component":
      return <RenderComponentNode node={node} />;
    case "section":
      return <RenderSection node={node} />;
    case "row":
      return <RenderRow node={node} />;
    case "column":
      return <RenderColumn node={node} />;
    default:
      return null;
  }
}

interface CmsCompositionProps {
  nodes: CompositionNode[];
}

export default function CmsComposition({ nodes }: CmsCompositionProps) {
  return (
    <>
      {nodes.map((node) => (
        <RenderNode key={node.key} node={node} />
      ))}
    </>
  );
}
