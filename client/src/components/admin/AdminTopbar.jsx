import Image from 'next/image';

export function AdminTopbar({ title, eyebrow, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white/95 px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a32]">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
        <Image src="/logoo-removebg.png" alt="Shambhala Home" width={884} height={244} className="h-auto w-40 object-contain" />
        {action}
      </div>
    </div>
  );
}
