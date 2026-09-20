# Supabase setup (one-time)

1. Create a project at supabase.com. Copy the URL, anon key, and service role key from
   **Project Settings → API** into `.env.local` (see `.env.example`) and into Vercel env vars.
2. **SQL Editor** → run `schema.sql`, then `seed.sql` (edit the roster first).
3. **Authentication → URL Configuration**: set Site URL to the production URL and add
   `http://localhost:3000/auth/callback` and `https://<prod>/auth/callback` to Redirect URLs.
4. **Authentication → Email Templates**: change the link in *Magic Link* and *Invite user* to the
   token-hash form so it works server-side and from any browser:

   - Magic Link: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink`
   - Invite user: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite`

5. **Authentication → Users → Invite user** for yourself (the exec row in `seed.sql`). After that,
   add everyone else through the "Add member" form on `/portal/exec`, which inserts the roster row
   and sends the invite in one step.
