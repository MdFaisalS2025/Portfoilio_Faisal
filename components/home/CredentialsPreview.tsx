import Link from "next/link";
import { featuredCredentials, CREDENTIAL_TYPE_LABEL } from "@/lib/data/credentials";

export function CredentialsPreview() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <p className="font-mono text-xs uppercase tracking-wide text-espresso-soft">
          Credentials
        </p>
        <Link
          href="/credentials"
          className="text-sm font-medium text-terracotta-dark hover:underline"
        >
          See all credentials →
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {featuredCredentials.map((c) => (
          <li key={c.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <div>
              <p className="text-sm font-medium text-espresso">{c.name}</p>
              <p className="text-xs text-espresso-soft">{c.issuer}</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wide text-espresso-soft whitespace-nowrap">
              {CREDENTIAL_TYPE_LABEL[c.type]} · {c.issued}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
