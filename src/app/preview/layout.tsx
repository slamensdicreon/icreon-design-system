import Script from "next/script";

const cmsUrl = process.env.OPTIMIZELY_CMS_URL;

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {cmsUrl && (
        <Script
          src={`${cmsUrl}/ui/CMS/latest/clientresources/communicationinjector.js`}
          strategy="afterInteractive"
        />
      )}
      {children}
    </>
  );
}
