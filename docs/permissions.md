# Permissions matrix

DevThread has a single role: **Author**. Every authenticated user can write.
There is no role hierarchy, no admin, no viewer — this is a personal
publication, not a team product.

The matrix below is the contract. Tests in `src/**/__tests__/` are generated
from it, so keep this in sync when anything changes.

## Roles
| Role | Who |
|---|---|
| `Author` | Any user with a valid session |

## Matrix (role × action)
Legend: ✅ allowed · ❌ denied · — not applicable

| Action | Anonymous | Author |
|---|---|---|
| Read homepage `/` | ✅ | ✅ |
| Read `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/terms`, `/privacy-policy`, `/disclaimer` | ✅ | ✅ |
| Read `/profile` | ❌ 401 | ✅ |
| Read `/write` | ❌ 401 | ✅ |
| Read `/edit/[slug]` | ❌ 401 | ✅ (own posts only) |
| `POST /api/upload` | ❌ 401 | ✅ |
| `createPost` (write) | ❌ 401 | ✅ |
| `updatePost` (edit) | ❌ 401 | ✅ only if `author_id === session user id` |
| `deletePost` | ❌ 401 | ✅ only if `author_id === session user id` |
| `logout` | ❌ 401 | ✅ |
| `updateProfile` (name + avatar) | ❌ 401 | ✅ (own record only) |
| `submitMessage` (contact) | ✅ | ✅ |
| `subscribe` (newsletter) | ✅ | ✅ |

## Ownership rule
Posts and profiles are owned by `author_id` / the user's own `id`. The single
central check, used by every endpoint:

```ts
const target = await selectPostBySlug(slug);
if (!target || target.authorId !== user.id) {
  // 404, not 403 — don't let URLs leak existence
  notFound();
}
```

A 403 means "you may not perform this action"; a 404 means "this thing doesn't
exist for you." Never return 403 for a missing/foreign resource.

## Decisions I own
- Whether to add roles (Admin / Editor / Viewer) later. Not now.
- Whether guest checkout / anonymous commenting ever ships. Not now.