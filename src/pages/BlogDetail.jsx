// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/blog/${id}`);
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
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">در حال بارگذاری...</div>;
  if (!blog) return null;

  const imageUrl = blog.image_url 
    ? (blog.image_url.startsWith('http') ? blog.image_url : `http://127.0.0.1:8000${blog.image_url}`)
    : null;

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-12">
        <button onClick={() => navigate('/blog')} className="mb-6 text-primary hover:underline flex items-center gap-2 text-sm font-bold">
          → بازگشت به لیست بلاگ‌ها
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{blog.title}</h1>
        <div className="text-sm text-gray-400 mb-8 border-b border-white/10 pb-4">
          {new Date(blog.created_at).toLocaleDateString('fa-IR')}
        </div>
        
        {imageUrl && (
          <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8 bg-gray-800 shadow-2xl">
            <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="text-gray-300 leading-loose text-base md:text-lg whitespace-pre-wrap">
          {blog.content}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
