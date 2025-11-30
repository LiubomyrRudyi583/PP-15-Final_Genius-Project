import { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { Plus, ThumbsUp, MessageCircle, Send, Trash2, CornerDownRight } from 'lucide-react';
import { CreatePostDialog } from './CreatePostDialog';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface ForumViewProps {
  currentUser: string;
  userAvatar: string;
}

export function ForumView({ currentUser, userAvatar }: ForumViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Усі');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        postsData.push({
          id: docSnap.id,
          title: data.title,
          content: data.content,
          author: data.author,
          avatar: data.avatar,
          category: data.category,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          likes: data.likes || 0,
          comments: data.comments || []
        } as Post);
      });

      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching forum posts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPost = async (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    try {
      await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: []
      });
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Помилка при створенні поста. Спробуйте ще раз.');
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      await updateDoc(doc(db, 'posts', postId), {
        likes: post.likes + 1
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const updateCommentInTree = (comments: Comment[], targetId: string, updateFn: (c: Comment) => Comment): Comment[] => {
    return comments.map(comment => {
      if (comment.id === targetId) {
        return updateFn(comment);
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, targetId, updateFn)
        };
      }
      return comment;
    });
  };

  const toggleCommentLike = async (postId: string, commentId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const updatedComments = updateCommentInTree(post.comments, commentId, (c) => ({ ...c, likes: c.likes + 1 }));

      await updateDoc(doc(db, 'posts', postId), {
        comments: updatedComments
      });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const deleteCommentFromTree = (comments: Comment[], targetId: string): Comment[] => {
    return comments.filter(c => c.id !== targetId).map(c => ({
      ...c,
      replies: c.replies ? deleteCommentFromTree(c.replies, targetId) : undefined
    }));
  };

  const deleteComment = async (postId: string, commentId: string, commentAuthor: string) => {
    if (commentAuthor !== currentUser) {
      alert('Ви можете видаляти тільки свої коментарі!');
      return;
    }

    if (confirm('Видалити коментар?')) {
      try {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const updatedComments = deleteCommentFromTree(post.comments, commentId);

        await updateDoc(doc(db, 'posts', postId), {
          comments: updatedComments
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Помилка при видаленні коментаря.');
      }
    }
  };

  const deletePost = async (postId: string, postAuthor: string) => {
    if (postAuthor !== currentUser) {
      alert('Ві можете видаляти тільки свої пости!');
      return;
    }

    if (confirm('Видалити пост?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Помилка при видаленні поста.');
      }
    }
  };

  const addReplyToTree = (comments: Comment[], parentId: string, newComment: Comment): Comment[] => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newComment]
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: addReplyToTree(comment.replies, parentId, newComment)
        };
      }
      return comment;
    });
  };

  const addComment = async (postId: string, parentId?: string) => {
    const inputKey = parentId || postId;
    const commentText = commentTexts[inputKey]?.trim();

    if (!commentText) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: currentUser,
      avatar: userAvatar,
      content: commentText,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      let updatedComments: Comment[];
      if (parentId) {
        updatedComments = addReplyToTree(post.comments, parentId, newComment);
      } else {
        updatedComments = [...post.comments, newComment];
      }

      await updateDoc(doc(db, 'posts', postId), {
        comments: updatedComments
      });

      setCommentTexts({ ...commentTexts, [inputKey]: '' });
      if (parentId) setReplyingTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Помилка при додаванні коментаря.');
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'щойно';
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    if (diffDays < 7) return `${diffDays} дн тому`;
    return date.toLocaleDateString('uk-UA');
  };

  const categories = ['Усі', 'Програмування', 'Математика', 'Фізика', 'Оголошення', 'Інше'];

  const filteredPosts = posts.filter(post =>
    filterCategory === 'Усі' || post.category === filterCategory
  );

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment, depth?: number }) => {
    const isReplying = replyingTo === comment.id;

    return (
      <div className={`flex flex-col gap-2 ${depth > 0 ? 'ml-6 border-l-2 border-violet-100 dark:border-violet-800 pl-3' : ''}`}>
        <div className="flex items-start gap-3 bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg">
          <div className="text-2xl">{comment.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{comment.author}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              {comment.author === currentUser && (
                <button
                  onClick={() => deleteComment(comment.postId, comment.id, comment.author)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  title="Видалити коментар"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleCommentLike(comment.postId, comment.id)}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 text-xs transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{comment.likes}</span>
              </button>

              <button
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 text-xs transition-colors"
              >
                <CornerDownRight className="w-3 h-3" />
                <span>Відповісти</span>
              </button>
            </div>

            {isReplying && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={commentTexts[comment.id] || ''}
                  onChange={(e) => setCommentTexts({ ...commentTexts, [comment.id]: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addComment(comment.postId, comment.id);
                    }
                  }}
                  placeholder={`Відповідь для ${comment.author}...`}
                  className="flex-1 px-3 py-1.5 border border-violet-200 dark:border-violet-700 dark:bg-gray-600 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => addComment(comment.postId, comment.id)}
                  className="px-3 py-1.5 bg-teal-400 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-500 dark:hover:bg-teal-700 transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Завантаження форуму...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-violet-700 dark:text-violet-300 mb-4">ШО там?</h2>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${filterCategory === cat
                ? 'bg-violet-400 dark:bg-violet-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-400 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-500 dark:hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Створити пост
        </button>
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Немає постів у цій категорії</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-700 border border-violet-200 dark:border-violet-800 rounded-xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 dark:text-gray-100 font-semibold">{post.title}</h3>
                        {post.author === currentUser && (
                          <button
                            onClick={() => deletePost(post.id, post.author)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                            title="Видалити пост"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.author} • {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                    <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-3 py-1 rounded-full ml-2">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>

              {expandedPost === post.id && (
                <div className="mt-4 pt-4 border-t border-violet-200 dark:border-violet-800 space-y-4">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          addComment(post.id);
                        }
                      }}
                      placeholder="Напишіть коментар..."
                      className="flex-1 px-4 py-2 border border-violet-200 dark:border-violet-700 dark:bg-gray-600 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 text-sm"
                    />
                    <button
                      onClick={() => addComment(post.id)}
                      className="px-4 py-2 bg-violet-400 dark:bg-violet-600 text-white rounded-lg hover:bg-violet-500 dark:hover:bg-violet-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {post.comments.length > 0 ? (
                    <div className="space-y-4">
                      {post.comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                      Ще немає коментарів. Будьте першим!
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showCreateDialog && (
        <CreatePostDialog
          onClose={() => setShowCreateDialog(false)}
          onAdd={addPost}
          currentUser={currentUser}
          userAvatar={userAvatar}
          categories={categories.filter(c => c !== 'Усі')}
        />
      )}
    </div>
  );
}
