export default function IdentityApp() {
  return (
    <div className="space-y-4 font-mono text-xs text-emerald-500/90 p-4">
      <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded">
        <p className="text-emerald-400 font-bold mb-2 uppercase tracking-wider">
          {" "}
          Subject_Profile
        </p>
        <p>
          <span className="text-zinc-500">NAME:</span> Jakub Pavlovič
        </p>
        <p>
          <span className="text-zinc-500">NICK_NAME:</span> Slowbat
        </p>
        <p>
          <span className="text-zinc-500">ROLE:</span> Full Stack Developer /
          Cyber Security Enthusiast
        </p>
        <p>
          <span className="text-zinc-500">LOCATION:</span> Secure_Node_CZ
        </p>
      </div>
      <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded">
        <p className="text-emerald-400 font-bold mb-2 uppercase tracking-wider">
          Bio_Data
        </p>
        <p>
          Im a passionate developer focused on building secure, scalable, and
          high-performance applications. Specialized in modern web technologies
          and defensive security practices.
        </p>
      </div>
    </div>
  );
}
