import toast from 'react-hot-toast';
// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiPackage, FiUsers, FiFileText, FiLogOut, FiPlus, FiX, FiCheck, FiAlertCircle, FiShoppingBag, FiSearch, FiEdit2, FiToggleLeft, FiToggleRight, FiImage, FiTrash2, FiTag, FiCreditCard, FiStar } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthorized, setIsAuthorized] = useState(null);
  
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [bankInfo, setBankInfo] = useState({ bank_name: '', account_holder_name: '', card_number: '', sheba_number: '' });
  const [isEditingBank, setIsEditingBank] = useState(false);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', image_url: '' });
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({ 
    total_users: 0, total_products: 0, pending_requests: 0,
    total_orders: 0, pending_orders: 0, paid_orders: 0,
    processing_orders: 0, shipped_orders: 0, deactivated_products: 0
  });

  const [approvingId, setApprovingId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('VISITOR');
  const [productSearch, setProductSearch] = useState('');
  const [showDeactivatedOnly, setShowDeactivatedOnly] = useState(false);

  const [productTab, setProductTab] = useState('base');
  const [productForm, setProductForm] = useState({
    title: '', title_en: '', description: '', image_url: '', brand_id: '', category_id: '',
    attributes: [{ name: '', values: [''] }],
    variants: [{ price_normal: '', price_visitor: '', price_shop_owner: '', price_wholesale: '', discount_percent: '', stock_quantity: '', selectedValueIds: [] }]
  });

  useEffect(() => {
    setIsAddProductOpen(false);
    setEditingProduct(null);
    setProductTab('base');
  }, [activeTab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setIsAuthorized(false); return; }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const payload = JSON.parse(jsonPayload);
      setIsAuthorized(payload.is_admin === true);
    } catch (e) { setIsAuthorized(false); }
  }, []);

  useEffect(() => {
    if (isAuthorized !== true) return;
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchData = async () => {
      try {
        if (activeTab === 'dashboard') {
          const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers });
          if (res.ok) setDashboardStats(await res.json());
        } else if (activeTab === 'products') {
          const res = await fetch(`${API_BASE_URL}/admin/products`, { headers });
          if (res.ok) setProductsList(await res.json());
          const resCats = await fetch(`${API_BASE_URL}/admin/categories`, { headers });
          if (resCats.ok) setCategories(await resCats.json());
          const resBrands = await fetch(`${API_BASE_URL}/admin/brands`, { headers });
          if (resBrands.ok) setBrands(await resBrands.json());
        } else if (activeTab === 'customers') {
          const res = await fetch(`${API_BASE_URL}/admin/partner-requests`, { headers });
          if (res.ok) setPartnerRequests(await res.json());
        } else if (activeTab === 'logs') {
          const res = await fetch(`${API_BASE_URL}/admin/audit-logs?limit=50`, { headers });
          if (res.ok) setLogs(await res.json());
        } else if (activeTab === 'orders') {
          const res = await fetch(`${API_BASE_URL}/admin/orders`, { headers });
          if (res.ok) setOrders(await res.json());
        } else if (activeTab === 'brands') {
          const res = await fetch(`${API_BASE_URL}/admin/brands`, { headers });
          if (res.ok) setBrands(await res.json());
        } else if (activeTab === 'bank-info') {
          fetchBankInfo();
        } else if (activeTab === 'categories') {
          const resCats = await fetch(`${API_BASE_URL}/admin/categories`, { headers });
          if (resCats.ok) setCategories(await resCats.json());
        } else if (activeTab === 'reviews') {
          const res = await fetch(`${API_BASE_URL}/reviews/admin/pending`, { headers });
          if (res.ok) setPendingReviews(await res.json());
        } else if (activeTab === 'blogs') {
          const res = await fetch(`${API_BASE_URL}/blog/`, { headers });
          if (res.ok) setBlogs(await res.json());
        }
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [activeTab, isAuthorized]);

  // ✅ NEW: Helper functions for clean status display
  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending_payment': return 'در انتظار پرداخت';
      case 'paid': return 'پرداخت شده';
      case 'processing': return 'در حال پردازش';
      case 'delivered': return 'ارسال شده';
      case 'cancelled': return 'لغو شده';
      case 'refunded': return 'مرجوع شده';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending_payment': return 'bg-yellow-500/20 text-yellow-400';
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'delivered': return 'bg-purple-500/20 text-purple-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'refunded': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleCreateOrUpdateProduct = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      let productId = editingProduct ? editingProduct.id : null;

      if (!editingProduct) {
        const res1 = await fetch(`${API_BASE_URL}/admin/products/`, { 
          method: 'POST', headers, 
          body: JSON.stringify({ 
            title: productForm.title, title_en: productForm.title_en, 
            description: productForm.description, image_url: productForm.image_url,
            brand_id: productForm.brand_id ? parseInt(productForm.brand_id) : null,
            category_id: productForm.category_id ? parseInt(productForm.category_id) : null
          }) 
        });
        if (!res1.ok) throw new Error('خطا در ایجاد محصول');
        const productData = await res1.json();
        productId = productData.id;
      } else {
        await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
          method: 'PUT', headers,
          body: JSON.stringify({
            title: productForm.title, title_en: productForm.title_en,
            description: productForm.description, image_url: productForm.image_url,
            brand_id: productForm.brand_id ? parseInt(productForm.brand_id) : null,
            category_id: productForm.category_id ? parseInt(productForm.category_id) : null,
            attributes: productForm.attributes.map(a => ({
              name: a.name,
              values: a.values.filter(v => v)
            })),
            variants: productForm.variants.map(v => ({
              id: v.id,
              sku: v.sku || `VAR-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              price_normal: parseFloat(v.price_normal) || 0,
              price_visitor: parseFloat(v.price_visitor) || 0,
              price_shop_owner: parseFloat(v.price_shop_owner) || 0,
              price_wholesale: parseFloat(v.price_wholesale) || 0,
              discount_percent: parseInt(v.discount_percent) || 0,
              stock_quantity: parseInt(v.stock_quantity) || 0,
              selectedValueIds: v.selectedValueIds.filter(id => typeof id === 'number' || typeof id === 'string')
            }))
          })
        });
      }

      if (!editingProduct && productId) {
        for (const attr of productForm.attributes) {
          if (!attr.name) continue;
          const resAttr = await fetch(`${API_BASE_URL}/admin/products/${productId}/attributes`, { method: 'POST', headers, body: JSON.stringify({ name: attr.name }) });
          if (resAttr.ok) {
            const attrData = await resAttr.json();
            for (const val of attr.values) {
              if (!val) continue;
              await fetch(`${API_BASE_URL}/admin/products/attributes/${attrData.id}/values`, { method: 'POST', headers, body: JSON.stringify({ value: val }) });
            }
          }
        }

        for (const variant of productForm.variants) {
          if (!variant.price_normal && !variant.stock_quantity) continue;
          const validSelectedIds = variant.selectedValueIds.filter(id => typeof id === 'number' || typeof id === 'string');
          await fetch(`${API_BASE_URL}/admin/products/${productId}/variants`, {
            method: 'POST', headers,
            body: JSON.stringify({ 
              sku: variant.sku || `VAR-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              purchase_cost: parseFloat(variant.price_normal) || 0,
              price_normal: parseFloat(variant.price_normal) || 0,
              price_visitor: parseFloat(variant.price_visitor) || 0,
              price_shop_owner: parseFloat(variant.price_shop_owner) || 0,
              price_wholesale: parseFloat(variant.price_wholesale) || 0,
              discount_percent: parseInt(variant.discount_percent) || 0,
              stock_quantity: parseInt(variant.stock_quantity) || 0, 
              attribute_value_ids: validSelectedIds
            })
          });
        }
      }

      toast.success(editingProduct ? 'محصول با موفقیت بروزرسانی شد!' : 'محصول با موفقیت ثبت شد!');
      setIsAddProductOpen(false);
      setEditingProduct(null);
      setProductForm({ title: '', title_en: '', description: '', image_url: '', brand_id: '', category_id: '', attributes: [{ name: '', values: [''] }], variants: [{ price_normal: '', price_visitor: '', price_shop_owner: '', price_wholesale: '', discount_percent: '', stock_quantity: '', selectedValueIds: [] }] });
      const resList = await fetch(`${API_BASE_URL}/admin/products`, { headers });
      if (resList.ok) setProductsList(await resList.json());
    } catch (error) {
      console.error(error);
      toast.error('خطای شبکه: ' + error.message);
    }
  };

  const handleImageUpload = async (file, setUrlFunc) => {
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUrlFunc(data.url); // Updates the image_url state
        toast.success('تصویر با موفقیت آپلود شد');
      } else {
        toast.error('خطا در آپلود تصویر');
      }
    } catch (error) {
      toast.error('خطای شبکه در آپلود');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('آیا از حذف این محصول اطمینان دارید؟')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProductsList(productsList.filter(p => p.id !== productId));
      } else {
        toast.error('خطا در حذف محصول');
      }
    } catch (error) {
      toast.error('خطای شبکه');
    }
  };

  const [newCatName, setNewCatName] = useState('');
  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
    setProductTab('base');
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${product.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProductForm({
          title: data.title || '',
          title_en: data.title_en || '',
          description: data.description || '',
          image_url: data.image_url || '',
          brand_id: data.brand_id ? String(data.brand_id) : '',
          category_id: data.category_id ? String(data.category_id) : '',
          attributes: data.attributes && data.attributes.length > 0 
            ? data.attributes 
            : [{ name: '', values: [''] }],
          variants: data.variants && data.variants.length > 0 
            ? data.variants.map(v => ({
                id: v.id,
                sku: v.sku || '',
                price_normal: String(v.price_normal || ''),
                price_visitor: String(v.price_visitor || ''),
                price_shop_owner: String(v.price_shop_owner || ''),
                price_wholesale: String(v.price_wholesale || ''),
                discount_percent: String(v.discount_percent || ''),
                stock_quantity: String(v.stock_quantity || ''),
                selectedValueIds: v.selectedValueIds || []
              }))
            : [{ price_normal: '', price_visitor: '', price_shop_owner: '', price_wholesale: '', stock_quantity: '', selectedValueIds: [] }]
        });
      } else {
        toast.error('خطا در دریافت اطلاعات محصول');
      }
    } catch (error) {
      console.error("Failed to load product details", error);
      toast.error('خطای شبکه در دریافت اطلاعات محصول');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName })
      });
      if (res.ok) {
        setNewCatName('');
        const resCats = await fetch(`${API_BASE_URL}/admin/categories`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (resCats.ok) setCategories(await resCats.json());
      }
    } catch (error) { toast.error('خطا در افزودن دسته‌بندی'); }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/categories/${catId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setCategories(categories.filter(c => c.id !== catId));
      else toast.error('خطا در حذف دسته‌بندی');
    } catch (error) { toast.error('خطای شبکه'); }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/brands`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName })
      });
      if (res.ok) {
        setNewBrandName('');
        const resBrands = await fetch(`${API_BASE_URL}/admin/brands`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (resBrands.ok) setBrands(await resBrands.json());
      }
    } catch (error) {
      toast.error('خطا در افزودن برند');
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm('آیا از حذف این برند اطمینان دارید؟')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/brands/${brandId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBrands(brands.filter(b => b.id !== brandId));
      } else {
        toast.error('خطا در حذف برند');
      }
    } catch (error) {
      toast.error('خطای شبکه');
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/partner-requests/${id}/approve`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_group: selectedGroup })
      });
      if (res.ok) {
        setApprovingId(null);
        const res2 = await fetch(`${API_BASE_URL}/admin/partner-requests`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res2.ok) setPartnerRequests(await res2.json());
      } else { toast.error('خطا در تایید'); }
    } catch (error) { toast.error('خطای شبکه'); }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/partner-requests/${id}/reject`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const res2 = await fetch(`${API_BASE_URL}/admin/partner-requests`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res2.ok) setPartnerRequests(await res2.json());
      }
    } catch (error) { toast.error('خطای شبکه'); }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: '' })
      });
      if (res.ok) {
        toast.success('وضعیت سفارش با موفقیت بروزرسانی شد');
        const res2 = await fetch(`${API_BASE_URL}/admin/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res2.ok) setOrders(await res2.json());
        setSelectedOrder(null);
      } else { 
        const errData = await res.json();
        toast.error(errData.detail || 'خطا در بروزرسانی'); 
      }
    } catch (error) { toast.error('خطای شبکه'); }
  };


  const fetchBankInfo = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/payment/admin/bank-info`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data) setBankInfo(data);
      }
    } catch (error) { console.error(error); }
  };

  const handleSaveBankInfo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/payment/admin/bank-info`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(bankInfo)
      });
      if (res.ok) {
        toast.success('اطلاعات بانکی با موفقیت بروزرسانی شد');
        setIsEditingBank(false);
      } else {
        toast.error('خطا در بروزرسانی اطلاعات');
      }
    } catch (error) { toast.error('خطای شبکه'); }
  };


  const handleAddBlog = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const url = editingBlogId ? `${API_BASE_URL}/blog/${editingBlogId}` : `${API_BASE_URL}/blog/`;
      const method = editingBlogId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog)
      });
      if (res.ok) {
        toast.success(editingBlogId ? 'بلاگ با موفقیت بروزرسانی شد' : 'بلاگ با موفقیت منتشر شد');
        setNewBlog({ title: '', content: '', image_url: '' });
        setEditingBlogId(null);
        const res2 = await fetch(`${API_BASE_URL}/blog/`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res2.ok) setBlogs(await res2.json());
      }
    } catch (error) { toast.error('خطا در ذخیره بلاگ'); }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id);
    setNewBlog({
      title: blog.title,
      content: blog.content,
      image_url: blog.image_url || ''
    });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('آیا از حذف این بلاگ اطمینان دارید؟')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/blog/${blogId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== blogId));
        toast.success('بلاگ حذف شد');
      }
    } catch (error) { toast.error('خطای شبکه'); }
  };

  const handleToggleBlogStatus = async (blogId, currentActive) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive })
      });
      if (res.ok) {
        const res2 = await fetch(`${API_BASE_URL}/blog/`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res2.ok) setBlogs(await res2.json());
        toast.success('وضعیت بلاگ تغییر کرد');
      }
    } catch (error) { toast.error('خطای شبکه'); }
  };

  const handleToggleProductStatus = async (productId, currentActive) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive })
      });
      if (res.ok) {
        const res2 = await fetch(`${API_BASE_URL}/admin/products`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res2.ok) setProductsList(await res2.json());
      }
    } catch (error) { toast.error('خطای شبکه'); }
  };

  console.log("ADMIN STATE: isAuthorized =", isAuthorized, "| activeTab =", activeTab);

  if (isAuthorized === false) {
    return (
      <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-white/5 rounded-3xl border border-red-500/20">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">دسترسی غیرمجاز</h1>
          <p className="text-gray-400">شما مجوز ورود به این بخش را ندارید.</p>
          <button onClick={() => navigate('/profile')} className="mt-6 text-primary hover:underline font-bold">بازگشت به پروفایل</button>
        </div>
      </div>
    );
  }
  if (isAuthorized === null) return <div className="min-h-screen bg-background flex items-center justify-center text-white">در حال بررسی...</div>;

  const navItems = [
    { id: 'dashboard', label: 'داشبورد', icon: FiHome },
    { id: 'orders', label: 'مدیریت سفارشات', icon: FiShoppingBag },
    { id: 'products', label: 'مدیریت محصولات', icon: FiPackage },
    { id: 'brands', label: 'مدیریت برندها', icon: FiTag },
    { id: 'categories', label: 'مدیریت دسته‌بندی‌ها', icon: FiTag },
    { id: 'customers', label: 'درخواست‌های همکاری', icon: FiUsers },
    { id: 'logs', label: 'گزارشات سیستم', icon: FiFileText },
    { id: 'reviews', label: 'مدیریت نظرات', icon: FiStar },
    { id: 'blogs', label: 'مدیریت بلاگ', icon: FiFileText },
    { id: 'bank-info', label: 'اطلاعات بانکی', icon: FiCreditCard },
  ];

  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) || (p.title_en && p.title_en.toLowerCase().includes(productSearch.toLowerCase()));
    return showDeactivatedOnly ? (matchesSearch && p.is_active === false) : matchesSearch;
  });

  const allAttrValues = productForm.attributes.flatMap((attr, aIdx) => 
    attr.values.filter(v => v).map((val, vIdx) => ({ id: `${aIdx}-${vIdx}`, label: `${attr.name}: ${val}` }))
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">

      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-8 flex gap-6">
        <aside className="w-[250px] shrink-0 hidden md:block">
          <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 sticky top-24">
            <div className="mb-6 pb-4 border-b border-white/10"><h2 className="text-lg font-bold text-primary">پنل مدیریت</h2></div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setShowDeactivatedOnly(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
                  <item.icon className="w-4 h-4" /> {item.label}
                </button>
              ))}
              <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium text-red-400 hover:bg-red-500/10 mt-6 border border-transparent">
                <FiLogOut className="w-4 h-4" /> خروج
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-1 bg-white/[0.035] border border-white/10 rounded-2xl p-6 min-h-[600px] relative">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">داشبورد مدیریت</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-6 text-center">
                  <FiUsers className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="text-3xl font-black text-white mb-1">{dashboardStats.total_users}</h3>
                  <p className="text-sm text-gray-400">کل کاربران</p>
                </div>
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-6 text-center">
                  <FiPackage className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-3xl font-black text-white mb-1">{dashboardStats.total_products}</h3>
                  <p className="text-sm text-gray-400">کل محصولات</p>
                </div>
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-6 text-center">
                  <FiAlertCircle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-3xl font-black text-white mb-1">{dashboardStats.pending_requests}</h3>
                  <p className="text-sm text-gray-400">درخواست‌های همکاری در انتظار</p>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-4">آمار سفارشات و محصولات</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 text-center"><h3 className="text-2xl font-black text-white mb-1">{dashboardStats.total_orders}</h3><p className="text-xs text-gray-400">کل سفارشات</p></div>
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 text-center"><h3 className="text-2xl font-black text-yellow-400 mb-1">{dashboardStats.pending_orders}</h3><p className="text-xs text-gray-400">در انتظار پرداخت</p></div>
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 text-center"><h3 className="text-2xl font-black text-green-400 mb-1">{dashboardStats.paid_orders}</h3><p className="text-xs text-gray-400">پرداخت شده</p></div>
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 text-center"><h3 className="text-2xl font-black text-blue-400 mb-1">{dashboardStats.processing_orders}</h3><p className="text-xs text-gray-400">در حال پردازش</p></div>
                <div className="bg-white/[0.025] border border-red-500/20 rounded-xl p-4 text-center cursor-pointer hover:bg-red-500/10 transition" onClick={() => { setActiveTab('products'); setShowDeactivatedOnly(true); }}>
                  <h3 className="text-2xl font-black text-red-400 mb-1">{dashboardStats.deactivated_products}</h3>
                  <p className="text-xs text-gray-400">محصولات غیرفعال (کلیک کنید)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">مدیریت دسته‌بندی‌ها</h1>
              <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
                <input type="text" placeholder="نام دسته‌بندی جدید" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition">افزودن دسته‌بندی</button>
              </form>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 relative group">
                    <h3 className="font-bold text-white">{cat.name}</h3>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition opacity-0 group-hover:opacity-100" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">مدیریت برندها</h1>
              <form onSubmit={handleAddBrand} className="flex gap-4 mb-8">
                <input type="text" placeholder="نام برند جدید" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition">افزودن برند</button>
              </form>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {brands.map(brand => (
                  <div key={brand.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 relative group">
                    <h3 className="font-bold text-white">{brand.name}</h3>
                    <button onClick={() => handleDeleteBrand(brand.id)} className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition opacity-0 group-hover:opacity-100" title="حذف برند">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-white">مدیریت محصولات {showDeactivatedOnly && <span className="text-red-400 text-lg">(فقط غیرفعال‌ها)</span>}</h1>
                <div className="flex gap-2">
                  {showDeactivatedOnly && <button onClick={() => setShowDeactivatedOnly(false)} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition">نمایش همه</button>}
                  <button onClick={() => { 
                    setEditingProduct(null); 
                    setProductForm({ title: '', title_en: '', description: '', image_url: '', brand_id: '', category_id: '', attributes: [{ name: '', values: [''] }], variants: [{ price_normal: '', price_visitor: '', price_shop_owner: '', price_wholesale: '', discount_percent: '', stock_quantity: '', selectedValueIds: [] }] }); 
                    setIsAddProductOpen(true); 
                    setProductTab('base'); 
                  }} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                    <FiPlus /> افزودن محصول جدید
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" placeholder="جستجوی محصول..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white outline-none focus:border-primary" />
                </div>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredProducts.length === 0 ? <p className="text-gray-500 text-center py-10">محصولی یافت نشد.</p> : filteredProducts.map((p, index) => (
                  <div key={p.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-500 w-6 text-center bg-white/5 rounded-full py-1">{index + 1}</span>
                      <div>
                        <h3 className={`font-bold ${p.is_active ? 'text-white' : 'text-gray-500 line-through'}`}>{p.title}</h3>
                      <p className="text-xs text-gray-400">{p.title_en}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-lg ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.is_active ? 'فعال' : 'غیرفعال'}</span>
                      <button onClick={() => handleEditProduct(p)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition" title="ویرایش"><FiEdit2 /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition" title="حذف"><FiTrash2 /></button>
                      <button onClick={() => handleToggleProductStatus(p.id, p.is_active)} className={`p-2 rounded-lg transition ${p.is_active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`} title={p.is_active ? "غیرفعال کردن" : "فعال کردن"}>
                        {p.is_active ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">مدیریت سفارشات</h1>
              <div className="space-y-3">
                {orders.length === 0 ? <p className="text-gray-500 text-center py-10">سفارشی یافت نشد.</p> : orders.map(order => (
                  <div key={order.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-white">سفارش #{order.id}</h3>
                      <p className="text-xs text-gray-400">مشتری: {order.user_name} ({order.user_phone})</p>
                      <p className="text-xs text-gray-400">{order.province}، {order.city} | {order.total_items} کالا</p>
                      {order.bank_tracking_number && (
                        <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                          <span>شماره پیگیری: {order.bank_tracking_number}</span>
                          <span className="text-gray-500">({new Date(order.paid_at).toLocaleString('fa-IR')})</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {/* ✅ FIXED: Uses helper functions for clean, accurate status display */}
                      <span className={`text-xs px-3 py-1 rounded-lg ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-white font-bold">{parseFloat(order.total_price).toLocaleString()} تومان</span>
                      <button onClick={() => setSelectedOrder(order)} className="text-primary hover:text-primary/80 p-2 bg-white/5 rounded-lg"><FiEdit2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">درخواست‌های همکاری</h1>
              <div className="space-y-4">
                {partnerRequests.length === 0 ? <p className="text-gray-500 text-center py-10">درخواستی وجود ندارد.</p> : partnerRequests.map(req => (
                  <div key={req.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-white">{req.business_name}</h3>
                      <p className="text-sm text-gray-400">{req.description}</p>
                      <div className="mt-2 flex gap-3 text-xs">
                        <span className="bg-white/10 px-2 py-1 rounded text-primary">📞 {req.user?.phone_number || 'N/A'}</span>
                        <span className="bg-white/10 px-2 py-1 rounded text-gray-300">👤 {req.user?.full_name || 'بدون نام'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      {approvingId === req.id ? (
                        <div className="flex gap-2 w-full md:w-auto items-center">
                          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary">
                            <option value="VISITOR">ویزیتور</option>
                            <option value="SHOP_OWNER">مغازه‌دار</option>
                            <option value="WHOLESALE">عمده‌فروش</option>
                          </select>
                          <button onClick={() => handleApprove(req.id)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 font-bold">تایید نهایی</button>
                          <button onClick={() => setApprovingId(null)} className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700">انصراف</button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => setApprovingId(req.id)} className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs hover:bg-green-500/20 border border-green-500/20 font-bold">تایید و انتخاب گروه</button>
                          <button onClick={() => handleReject(req.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 border border-red-500/20 font-bold">رد درخواست</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bank-info' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">مدیریت اطلاعات بانکی (کارت به کارت)</h1>
              <div className="bg-white/[0.025] border border-white/10 rounded-xl p-6 max-w-2xl">
                {!isEditingBank ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="text-lg font-bold text-primary">اطلاعات فعلی</h3>
                      <button onClick={() => setIsEditingBank(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition">ویرایش اطلاعات</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><p className="text-gray-400">نام بانک</p><p className="text-white font-bold">{bankInfo.bank_name || 'تنظیم نشده'}</p></div>
                      <div><p className="text-gray-400">نام صاحب حساب</p><p className="text-white font-bold">{bankInfo.account_holder_name || 'تنظیم نشده'}</p></div>
                      <div><p className="text-gray-400">شماره کارت</p><p className="text-white font-bold font-mono" dir="ltr">{bankInfo.card_number || '---'}</p></div>
                      <div><p className="text-gray-400">شماره شبا</p><p className="text-white font-bold font-mono" dir="ltr">{bankInfo.sheba_number || '---'}</p></div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveBankInfo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required placeholder="نام بانک (مثال: بانک رسالت)" value={bankInfo.bank_name} onChange={e => setBankInfo({...bankInfo, bank_name: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                      <input required placeholder="نام صاحب حساب" value={bankInfo.account_holder_name} onChange={e => setBankInfo({...bankInfo, account_holder_name: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                      <input required placeholder="شماره کارت (16 رقم)" value={bankInfo.card_number} onChange={e => setBankInfo({...bankInfo, card_number: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono" dir="ltr" maxLength="16" />
                      <input required placeholder="شماره شبا (IR...)" value={bankInfo.sheba_number} onChange={e => setBankInfo({...bankInfo, sheba_number: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono" dir="ltr" />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition">ذخیره تغییرات</button>
                      <button type="button" onClick={() => { setIsEditingBank(false); fetchBankInfo(); }} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition">انصراف</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">گزارشات سیستم</h1>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {logs.length === 0 ? <p className="text-gray-500 text-center py-10">گزارشی وجود ندارد.</p> : logs.map(log => (
                  <div key={log.id} className="bg-white/[0.025] border border-white/10 rounded-lg p-3 text-sm flex justify-between">
                    <span className="text-primary font-bold">{log.action}</span>
                    <span className="text-gray-400">{log.target_type} #{log.target_id}</span>
                    <span className="text-gray-500 text-xs">{new Date(log.created_at).toLocaleString('fa-IR')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}


          {activeTab === 'reviews' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">مدیریت نظرات کاربران</h1>
              <div className="space-y-4">
                {pendingReviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 bg-white/[0.025] border border-white/10 rounded-xl">هیچ نظر در انتظار تاییدی وجود ندارد.</p>
                ) : (
                  pendingReviews.map(review => (
                    <div key={review.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-400 font-bold text-sm">امتیاز: {review.rating} از ۵</span>
                          <span className="text-xs text-gray-500">|</span>
                          <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleString('fa-IR')}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{review.comment || 'بدون متن'}</p>
                        <p className="text-xs text-primary mt-2">کاربر ID: {review.user_id}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            try {
                              const res = await fetch(`${API_BASE_URL}/reviews/${review.id}/approve`, { 
                                method: 'POST', 
                                headers: { 'Authorization': `Bearer ${token}` } 
                              });
                              if (res.ok) {
                                setPendingReviews(pendingReviews.filter(r => r.id !== review.id));
                                toast.success('نظر با موفقیت تایید شد');
                              }
                            } catch (err) { toast.error('خطا در تایید نظر'); }
                          }}
                          className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold hover:bg-green-500/30 transition flex items-center gap-2"
                        >
                          <FiCheck /> تایید
                        </button>
                        <button 
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            try {
                              const res = await fetch(`${API_BASE_URL}/reviews/${review.id}/reject`, { 
                                method: 'DELETE', 
                                headers: { 'Authorization': `Bearer ${token}` } 
                              });
                              if (res.ok) {
                                setPendingReviews(pendingReviews.filter(r => r.id !== review.id));
                                toast.success('نظر رد و حذف شد');
                              }
                            } catch (err) { toast.error('خطا در رد نظر'); }
                          }}
                          className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold hover:bg-red-500/30 transition flex items-center gap-2"
                        >
                          <FiX /> رد کردن
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}


          {activeTab === 'blogs' && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">مدیریت بلاگ</h1>
              <form onSubmit={handleAddBlog} className="bg-white/[0.025] border border-white/10 rounded-xl p-6 mb-8 space-y-4">
                <h3 className="text-lg font-bold text-primary mb-4">{editingBlogId ? 'ویرایش بلاگ' : 'افزودن بلاگ جدید'}</h3>
                <input 
                  type="text" 
                  placeholder="عنوان بلاگ" 
                  value={newBlog.title} 
                  onChange={e => setNewBlog({...newBlog, title: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" 
                  required
                />
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/20 hover:bg-white/5 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <p className="text-xs text-gray-400">{newBlog.image_url ? 'تصویر انتخاب شد' : 'کلیک کنید یا تصویر را اینجا رها کنید'}</p>
                      {newBlog.image_url && <p className="text-[10px] text-primary mt-1 truncate max-w-[200px]">{newBlog.image_url}</p>}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { handleImageUpload(e.target.files[0], (url) => setNewBlog({...newBlog, image_url: url})); e.target.value = ''; }} disabled={uploadingImage} />
                  </label>
                  {uploadingImage && <p className="text-xs text-primary mt-1 text-center">در حال آپلود...</p>}
                </div>
                <textarea 
                  placeholder="متن بلاگ" 
                  value={newBlog.content} 
                  onChange={e => setNewBlog({...newBlog, content: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary h-32" 
                  required
                />
                <div className="flex gap-3">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition">{editingBlogId ? 'بروزرسانی' : 'انتشار بلاگ'}</button>
                  {editingBlogId && (
                    <button type="button" onClick={() => { setEditingBlogId(null); setNewBlog({ title: '', content: '', image_url: '' }); }} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition">انصراف</button>
                  )}
                </div>
              </form>
              <div className="space-y-4">
                {blogs.length === 0 ? <p className="text-gray-500 text-center py-10">بلاگی یافت نشد.</p> : blogs.map(blog => (
                  <div key={blog.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {blog.image_url && <img src={blog.image_url.startsWith('http') ? blog.image_url : `http://127.0.0.1:8000${blog.image_url}`} alt={blog.title} className="w-16 h-16 rounded-lg object-cover" />}
                      <div>
                        <h3 className={`font-bold ${blog.is_active ? 'text-white' : 'text-gray-500 line-through'}`}>{blog.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-1">{blog.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-lg ${blog.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{blog.is_active ? 'فعال' : 'غیرفعال'}</span>
                      <button onClick={() => handleEditBlog(blog)} className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition" title="ویرایش"><FiEdit2 /></button>
                      <button onClick={() => handleToggleBlogStatus(blog.id, blog.is_active)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition" title="تغییر وضعیت"><FiToggleRight size={24} /></button>
                      <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAddProductOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-4xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold text-white">{editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
                  <button onClick={() => { setIsAddProductOpen(false); setEditingProduct(null); }} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
                </div>

                <div className="flex border-b border-white/10 mb-6">
                  <button onClick={() => setProductTab('base')} className={`py-3 px-6 font-bold transition ${productTab === 'base' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>۱. اطلاعات پایه</button>
                  <button onClick={() => setProductTab('attrs')} className={`py-3 px-6 font-bold transition ${productTab === 'attrs' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>۲. ویژگی‌ها و مشخصات</button>
                  <button onClick={() => setProductTab('variants')} className={`py-3 px-6 font-bold transition ${productTab === 'variants' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>۳. واریانت‌ها</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 mb-6">
                  {productTab === 'base' && (
                    <div className="space-y-4">
                      <input type="text" placeholder="نام محصول" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                      <input type="text" placeholder="نام محصول (انگلیسی)" value={productForm.title_en} onChange={e => setProductForm({...productForm, title_en: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" dir="ltr" />
                      <select value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary appearance-none mb-4">
                        <option value="">انتخاب دسته‌بندی (اختیاری)</option>
                        {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                      </select>
                      <select value={productForm.brand_id} onChange={e => setProductForm({...productForm, brand_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary appearance-none">
                        <option value="">انتخاب برند (اختیاری)</option>
                        {brands.map(b => <option key={b.id} value={b.id} className="text-black">{b.name}</option>)}
                      </select>
                      <div className="relative">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiImage className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-xs text-gray-400">{productForm.image_url ? 'تصویر انتخاب شد (برای تغییر کلیک کنید)' : 'کلیک کنید یا تصویر را اینجا رها کنید'}</p>
                            {productForm.image_url && <p className="text-[10px] text-primary mt-1 truncate max-w-[200px]">{productForm.image_url}</p>}
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], (url) => setProductForm({...productForm, image_url: url}))} disabled={uploadingImage} />
                        </label>
                        {uploadingImage && <p className="text-xs text-primary mt-1 text-center">در حال آپلود...</p>}
                      </div>
                      <textarea placeholder="توضیحات" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary h-32" />
                    </div>
                  )}

                  {productTab === 'attrs' && (
                    <div className="space-y-4">
                      {productForm.attributes.map((attr, attrIndex) => (
                        <div key={attrIndex} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                          <input type="text" placeholder="نام ویژگی" value={attr.name} onChange={e => {
                            const newAttrs = [...productForm.attributes];
                            newAttrs[attrIndex].name = e.target.value;
                            setProductForm({...productForm, attributes: newAttrs});
                          }} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" dir="ltr" />
                          <div className="flex flex-wrap gap-2">
                            {attr.values.map((val, valIndex) => (
                              <input key={valIndex} type="text" placeholder="مقدار" value={val} onChange={e => {
                                const newAttrs = [...productForm.attributes];
                                newAttrs[attrIndex].values[valIndex] = e.target.value;
                                setProductForm({...productForm, attributes: newAttrs});
                              }} className="flex-1 min-w-[100px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none" dir="ltr" />
                            ))}
                            <button onClick={() => {
                              const newAttrs = [...productForm.attributes];
                              newAttrs[attrIndex].values.push('');
                              setProductForm({...productForm, attributes: newAttrs});
                            }} className="bg-green-500/20 text-green-400 px-3 rounded-lg text-xs hover:bg-green-500/30">+ مقدار</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setProductForm(prev => ({...prev, attributes: [...prev.attributes, { name: '', values: [''] }]}))} className="text-sm text-primary hover:underline">+ افزودن ویژگی جدید</button>
                    </div>
                  )}

                  {productTab === 'variants' && (
                    <div className="space-y-4">
                      {productForm.variants.map((variant, vIdx) => (
                        <div key={vIdx} className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-primary">واریانت #{vIdx + 1}</h4>
                            {productForm.variants.length > 1 && (
                              <button onClick={() => {
                                const newVariants = productForm.variants.filter((_, i) => i !== vIdx);
                                setProductForm({...productForm, variants: newVariants});
                              }} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                            )}
                          </div>
                          <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                            <p className="text-xs text-gray-400 mb-2">انتخاب ویژگی‌ها برای این واریانت:</p>
                            <div className="flex flex-wrap gap-2">
                              {allAttrValues.map(av => {
                                const isSelected = variant.selectedValueIds.includes(av.id);
                                return (
                                  <button key={av.id} onClick={() => {
                                    const newVariants = [...productForm.variants];
                                    const currentIds = newVariants[vIdx].selectedValueIds;
                                    newVariants[vIdx].selectedValueIds = isSelected ? currentIds.filter(id => id !== av.id) : [...currentIds, av.id];
                                    setProductForm({...productForm, variants: newVariants});
                                  }} className={`px-3 py-1 rounded-lg text-xs transition ${isSelected ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                                    {av.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">قیمت کاربر عادی</label>
                                <input type="number" placeholder="تومان" value={variant.price_normal} onChange={e => { const n = [...productForm.variants]; n[vIdx].price_normal = e.target.value; setProductForm({...productForm, variants: n}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" dir="ltr" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">قیمت ویزیتور</label>
                                <input type="number" placeholder="تومان" value={variant.price_visitor} onChange={e => { const n = [...productForm.variants]; n[vIdx].price_visitor = e.target.value; setProductForm({...productForm, variants: n}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" dir="ltr" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">قیمت مغازه‌دار</label>
                                <input type="number" placeholder="تومان" value={variant.price_shop_owner} onChange={e => { const n = [...productForm.variants]; n[vIdx].price_shop_owner = e.target.value; setProductForm({...productForm, variants: n}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" dir="ltr" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">قیمت عمده‌فروش</label>
                                <input type="number" placeholder="تومان" value={variant.price_wholesale} onChange={e => { const n = [...productForm.variants]; n[vIdx].price_wholesale = e.target.value; setProductForm({...productForm, variants: n}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" dir="ltr" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">درصد تخفیف (%)</label>
                                <input type="number" min="0" max="100" placeholder="مثال: 20" value={variant.discount_percent} onChange={e => { const n = [...productForm.variants]; n[vIdx].discount_percent = e.target.value; setProductForm({...productForm, variants: n}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" dir="ltr" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">موجودی انبار</label>
                                <input type="number" placeholder="موجودی" value={variant.stock_quantity} onChange={e => { const n = [...productForm.variants]; n[vIdx].stock_quantity = e.target.value; setProductForm({...productForm, variants: n}); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" dir="ltr" />
                              </div>
                            </div>
                        </div>
                      ))}
                      <button onClick={() => setProductForm(prev => ({...prev, variants: [...prev.variants, { price: '', stock_quantity: '', selectedValueIds: [] }]}))} className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 rounded-xl hover:border-primary hover:text-primary transition font-bold">
                        + افزودن واریانت جدید
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/10">
                  <button onClick={() => {
                    if (productTab === 'attrs') setProductTab('base');
                    else if (productTab === 'variants') setProductTab('attrs');
                  }} className={`px-6 py-3 rounded-xl font-bold transition ${productTab === 'base' ? 'invisible' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                    قبلی
                  </button>
                  
                  {productTab === 'variants' || editingProduct ? (
                    <button onClick={handleCreateOrUpdateProduct} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition flex items-center gap-2">
                      <FiCheck /> {editingProduct ? 'ذخیره تغییرات' : 'ثبت نهایی محصول'}
                    </button>
                  ) : (
                    <button onClick={() => {
                      if (productTab === 'base') setProductTab('attrs');
                      else if (productTab === 'attrs') setProductTab('variants');
                    }} className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition flex items-center gap-2">
                      مرحله بعد
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedOrder && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 sticky top-0 bg-[#1a1a1a] z-10">
                  <h2 className="text-xl font-bold text-white">جزئیات سفارش #{selectedOrder.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm text-gray-400">مشتری</p><p className="text-white font-bold">{selectedOrder.user_name}</p></div>
                    <div><p className="text-sm text-gray-400">شماره تماس</p><p className="text-white font-bold" dir="ltr">{selectedOrder.user_phone}</p></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">آدرس ارسال</p>
                    <p className="text-white">{selectedOrder.province}، {selectedOrder.city}</p>
                    <p className="text-white text-sm">{selectedOrder.full_address}</p>
                    <p className="text-white text-sm">کد پستی: {selectedOrder.postal_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">اقلام سفارش</p>
                    <p className="text-white text-sm">{selectedOrder.total_items} قلم کالا - مجموع: {parseFloat(selectedOrder.total_price).toLocaleString()} تومان</p>
                  </div>
                  
                  {/* ✅ UPDATED: Clean Dropdown without "تکمیل شده" or parentheses */}
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-gray-400 mb-2">تغییر وضعیت سفارش</p>
                    <div className="flex gap-2">
                      <select 
                        id="order-status-select"
                        defaultValue={selectedOrder.status}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary"
                      >
                        <option value="pending_payment">در انتظار پرداخت</option>
                        <option value="paid">پرداخت شده</option>
                        <option value="processing">در حال پردازش</option>
                        <option value="delivered">ارسال شده</option>
                        <option value="cancelled">لغو شده</option>
                        <option value="refunded">مرجوع شده</option>
                      </select>
                      <button 
                        onClick={() => {
                          const selectElement = document.getElementById('order-status-select');
                          if (selectElement) {
                            handleUpdateOrderStatus(selectedOrder.id, selectElement.value);
                          }
                        }} 
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold transition"
                      >
                        اعمال تغییرات
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;