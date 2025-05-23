import Image from 'next/image'

/**
 * ลิงก์ไปยังแหล่งข้อมูลต่าง ๆ ที่แสดงเป็นการ์ด
 */
const ResourceCard = ({ title, description, href }: { title: string; description: string; href: string }) => (
  <a
    href={href}
    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2 className="mb-3 text-2xl font-semibold">
      {title}{' '}
      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        -&gt;
      </span>
    </h2>
    <p className="m-0 max-w-[30ch] text-sm opacity-50">{description}</p>
  </a>
)

/**
 * ส่วนแสดงโลโก้ Vercel ที่ด้านล่าง (หรือ static ด้านบนบนจอใหญ่)
 */
const Footer = () => (
  <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
    <a
      className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
      href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      By{' '}
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        className="dark:invert"
        width={100}
        height={24}
        priority
      />
    </a>
  </div>
)

/**
 * ส่วนโลโก้กลางหน้า (Next.js)
 */
const CenterLogo = () => (
  <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
    <Image
      className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
      src="/next.svg"
      alt="Next.js Logo"
      width={180}
      height={37}
      priority
    />
  </div>
)

/**
 * หน้า Home หลัก
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Top bar/footer */}
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Footer />
      </div>

      {/* Center logo */}
      <CenterLogo />

      {/* Resource links */}
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-8 lg:text-left">
        <ResourceCard
          title="Download HyperCode Engine"
          description=""
          href="https://github.com/HyperCodeCrew/FNF-HyperCode-Engine"
        />
        <ResourceCard
          title="Documentation"
          description="Find in-depth information about Next.js features and API."
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        />
        <ResourceCard
          title="Donate"
          description="Donate to the project"
          href="https://easydonate.app/paopun2060"
        />
      </div>
    </main>
  )
}
