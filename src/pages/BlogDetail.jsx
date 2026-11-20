import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ✅ Sanitizes blog HTML: removes dark-mode highlight styles, fixes broken links
const sanitizeBlogHtml = (raw) => {
  if (!raw) return '';
  let html = raw;
  // 1. Remove ALL inline style attributes (kills the "highlighted text" boxes)
  html = html.replace(/\sstyle="[^"]*"/gi, '');
  html = html.replace(/\sstyle='[^']*'/gi, '');
  // 2. Fix links that point to chat.qwen.ai → make them internal relative links
  html = html.replace(/https:\/\/chat\.qwen\.ai\//gi, '/');
  // 3. Remove target=_blank so internal links navigate inside the SPA
  html = html.replace(/\starget="_blank"/gi, '');
  return html;
};

// ✅ Plain-text version (for meta description & previews)
const htmlToPlainText = (raw) =>
  sanitizeBlogHtml(raw)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/blog/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          navigate('/blog');
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, navigate, API_URL]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">در حال بارگذاری...</div>;
  if (!blog) return null;

  const imageUrl = blog.image_url
    ? (blog.image_url.startsWith('http') ? blog.image_url : `${API_URL.replace('/api/v1', '')}${blog.image_url}`)
    : null;

  const cleanContent = sanitizeBlogHtml(blog.content);
  const plainText = htmlToPlainText(blog.content);

  const seoTitle = blog.meta_title || `${blog.title} | مجله آموزشی ونیکس`;
  const seoDescription = blog.meta_description || (plainText.substring(0, 160) + '...');

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`https://venixpodshop.ir/blog/${id}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://venixpodshop.ir/blog/${id}`} />
      </Helmet>

      <Header />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 md:px-6 py-8 md:py-12">
        <button onClick={() => navigate('/blog')} className="mb-4 md:mb-6 text-primary hover:underline flex items-center gap-2 text-sm font-bold">
          ← بازگشت به لیست بلاگ‌ها
        </button>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">{blog.title}</h1>
        <div className="text-sm text-gray-400 mb-8 border-b border-white/10 pb-4">
          {new Date(blog.created_at).toLocaleDateString('fa-IR')}
        </div>

        {imageUrl && (
          <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden mb-6 md:mb-8 bg-gray-800 shadow-2xl">
            <img src={imageUrl} alt={blog.image_alt_text || blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* ✅ Render sanitized HTML */}
        <div
          className="blog-content text-gray-300 leading-relaxed md:leading-loose text-sm md:text-base lg:text-lg"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;