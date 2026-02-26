'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import type { JournalPost } from '@/lib/types'
import { urlFor } from '../../../sanity/lib/image'
import styles from './page.module.css'

interface JournalClientProps {
  posts: JournalPost[]
}

export default function JournalClient({ posts }: JournalClientProps) {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.title}>Journal</h1>
        {posts.length > 0 ? (
          <div className={styles.list}>
            {posts.map((post) => (
              <article key={post._id} className={styles.postItem}>
                {post.coverImage?.asset && (
                  <Image
                    src={urlFor(post.coverImage).width(400).height(280).url()}
                    alt={post.title}
                    width={400}
                    height={280}
                    className={styles.postImage}
                  />
                )}
                <div className={styles.postContent}>
                  <div className={styles.postTitle}>{post.title}</div>
                  <div className={styles.postDate}>
                    {new Date(post.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  {post.content && (
                    <div className={styles.postBody}>
                      <PortableText value={post.content} />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Aucun article pour le moment.</p>
        )}
      </div>
      <Footer />
    </>
  )
}
