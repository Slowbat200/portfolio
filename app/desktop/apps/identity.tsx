export default function IdentityApp() {
  return (
    <div className="space-y-4 font-mono text-sm md:text-[15px] text-zinc-600 dark:text-emerald-500/90 p-4">
      <div className="p-3 border border-zinc-200 dark:border-emerald-500/20 bg-zinc-50 dark:bg-emerald-500/5 rounded">
        <p className="text-zinc-800 dark:text-emerald-400 font-bold mb-2 uppercase tracking-wider text-xs md:text-sm"> Subject_Profile</p>
        <div className="space-y-1">
          <p><span className="text-zinc-400 dark:text-zinc-500">NAME:</span> Jan Doe</p>
          <p><span className="text-zinc-400 dark:text-zinc-500">ROLE:</span> Full Stack Developer / Cyber Security Enthusiast</p>
          <p><span className="text-zinc-400 dark:text-zinc-500">LOCATION:</span> Secure_Node_CZ</p>
        </div>
      </div>
      <div className="p-3 border border-zinc-200 dark:border-emerald-500/20 bg-zinc-50 dark:bg-emerald-500/5 rounded">
        <p className="text-zinc-800 dark:text-emerald-400 font-bold mb-2 uppercase tracking-wider text-xs md:text-sm">Bio_Data</p>
        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
          I am a passionate full-stack web developer with a love for crafting
          dynamic and responsive websites that not only meet but exceed modern
          expectations and security. My toolkit includes a curated selection of the latest
          and greatest technologies, ensuring that every project I undertake is
          a showcase of innovation and efficiency. In my journey as a web
          developer, I specialize in utilizing powerful tools such as Next.js,
          React, Typescript, TailwindCSS, Supabase, and Prisma DB. These
          technologies form the backbone of my development process, allowing me
          to create secure, user-friendly, and visually great web
          applications.
        </p>
      </div>
    </div>
  );
}
