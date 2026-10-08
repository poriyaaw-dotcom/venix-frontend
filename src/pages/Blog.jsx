// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blog/`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1197px] w-full mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">بلاگ تخصصی VENIX</h1>
        
        {loading ? (
          <div className="text-center text-gray-400 py-20">در حال بارگذاری...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-400 py-20">هنوز هیچ بلاگی منتشر نشده است.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} onClick={() => navigate(`/blog/${blog.id}`)} className="bg-white/[0.035] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition duration-300 flex flex-col cursor-pointer group">
                <div className="h-48 bg-gray-800 relative overflow-hidden">
                  {blog.image_url ? (
                    <img 
                      src={blog.image_url.startsWith('http') ? blog.image_url : `http://127.0.0.1:8000${blog.image_url}`} 
                      alt={blog.title} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl font-bold">VENIX</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4 flex-grow">{blog.content}</p>
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <span className="text-xs text-gray-500">
                      {new Date(blog.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
