import { Mail } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Author } from "@/lib/articles";
import { format } from "@/lib/i18n";
import { LinkedInIcon, XIcon } from "@/components/brand-icons";
import { AuthorAvatar } from "@/components/actualite/author-avatar";
import { SectionTitle } from "@/components/actualite/section-title";
import { ShareButtons } from "@/components/actualite/share-buttons";

const iconLink = "flex size-8 items-center justify-center hover:bg-stone-100";

// Left column of an article: "Written by" and "Share this article".
export const ArticleAuthorAside = ({
  author,
  title,
  blog,
}: {
  author: Author | null;
  title: string;
  blog: Dictionary["blog"];
}) => (
  <aside className="space-y-12 lg:sticky lg:top-24">
    {author && (
      <section>
        <SectionTitle>{blog.writtenBy}</SectionTitle>
        <div className="mt-6 flex items-start gap-4 border-y border-black/10 py-5">
          <AuthorAvatar author={author} size={64} />
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-black">{author.display_name}</p>
            {author.job_title && (
              <p className="mt-1 leading-snug text-muted-foreground">{author.job_title}</p>
            )}
            {(author.linkedin_url || author.x_url || author.contact_email) && (
              <div className="-ms-1.5 mt-3 flex items-center gap-1 text-black">
                {author.linkedin_url && (
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={format(blog.author.linkedIn, { name: author.display_name })}
                    className={iconLink}
                  >
                    <LinkedInIcon className="size-4" />
                  </a>
                )}
                {author.x_url && (
                  <a
                    href={author.x_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={format(blog.author.x, { name: author.display_name })}
                    className={iconLink}
                  >
                    <XIcon className="size-3.5" />
                  </a>
                )}
                {author.contact_email && (
                  <a
                    href={`mailto:${author.contact_email}`}
                    aria-label={format(blog.author.email, { name: author.display_name })}
                    title={author.contact_email}
                    className={iconLink}
                  >
                    <Mail className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    )}

    <section>
      <SectionTitle>{blog.share}</SectionTitle>
      <div className="mt-6 border-y border-black/10 py-4">
        <ShareButtons title={title} labels={blog.shareButtons} />
      </div>
    </section>
  </aside>
);
