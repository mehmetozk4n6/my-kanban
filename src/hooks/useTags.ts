"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Tag } from "@/lib/types";

/**
 * Real-time listener for the user's tags
 */
export function useTags(userId: string | undefined) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTags([]);
      setLoading(false);
      return;
    }

    const tagsRef = collection(db, "tags");
    const q = query(tagsRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tagList: Tag[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tag[];

      setTags(tagList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  /**
   * Get a tag by ID
   */
  function getTagById(tagId: string): Tag | undefined {
    return tags.find((t) => t.id === tagId);
  }

  return { tags, loading, getTagById };
}
