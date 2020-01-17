declare module 'remark-mdx' {
  export default function mdx(): void;
}

declare module 'remark-mdx-to-plain-text' {
  const strip: { settings: any };
  export default strip;
}
