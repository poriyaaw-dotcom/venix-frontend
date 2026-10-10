import toast from 'react-hot-toast';
// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiLogOut, FiBox, FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ phone: '', fullName: '', isAdmin: false, group: 'NORMAL', businessName: '' });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newAddress, setNewAddress] = useState({ province: '', city: '', full_address: '', postal_code: '', phone: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // 1. Fetch real user profile
        const userRes = await fetch('http://127.0.0.1:8000/api/v1/auth/me', { headers });
        
        // ✅ SECURITY FIX: If backend rejects token (401), kick user out
        if (userRes.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserData({ 
            phone: userData.phone_number, 
            fullName: userData.full_name || '', 
            isAdmin: userData.is_admin, 
            group: userData.customer_group,
            businessName: '' 
          });
          
          const names = (userData.full_name || '').split(' ');
          setFirstName(names[0] || '');
          setLastName(names.slice(1).join(' ') || '');

          // ✅ ADDRESS FIX: Load addresses from localStorage fallback
          const savedData = localStorage.getItem(`venix_data_${userData.phone_number}`);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            setAddresses(parsed.addresses || []);
          }
        }

        // 2. Fetch real order history
        setLoadingOrders(true);
        const ordersRes = await fetch('http://127.0.0.1:8000/api/v1/auth/me/orders', { headers });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
        setLoadingOrders(false);

      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setLoadingOrders(false);
      }
    };

    fetchData();
  }, [navigate]);

  const getRoleLabel = () => {
    if (userData.isAdmin) return 'مدیر سیستم';
    if (['VISITOR', 'SHOP_OWNER', 'WHOLESALE'].includes(userData.group)) return 'کاربر همکار';
    return 'کاربر عادی';
  };

  const saveToStorage = (newFullName, newAddresses, newBusinessName) => {
    const dataToSave = { fullName: newFullName, addresses: newAddresses, businessName: newBusinessName || userData.businessName };
    localStorage.setItem(`venix_data_${userData.phone}`, JSON.stringify(dataToSave));
  };

  const handleSaveInfo = async () => {
    const newFullName = `${firstName} ${lastName}`.trim();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: newFullName })
      });
      
      if (res.ok) {
        setUserData({ ...userData, fullName: newFullName });
        saveToStorage(newFullName, addresses, userData.businessName);
        toast.success('اطلاعات با موفقیت در سرور ذخیره شد!');
        setIsEditModalOpen(false);
      } else {
        toast.error('خطا در ذخیره اطلاعات');
      }
    } catch (error) {
      console.error(error);
      toast.error('خطای شبکه');
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.province || !newAddress.city || !newAddress.full_address) return toast.error('لطفا استان، شهر و آدرس را وارد کنید');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/auth/me/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAddress)
      });
      
      if (res.ok) {
        const savedAddr = await res.json();
        const updatedAddresses = [...addresses, savedAddr];
        setAddresses(updatedAddresses);
        localStorage.setItem('venix_current_user_addresses', JSON.stringify(updatedAddresses));
        toast.success('آدرس با موفقیت در سرور ذخیره شد');
        setNewAddress({ province: '', city: '', full_address: '', postal_code: '', phone: '' });
      } else {
        throw new Error('Backend failed');
      }
    } catch (error) {
      // Fallback to localStorage if backend endpoint doesn't exist yet
      const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
      setAddresses(updatedAddresses);
      localStorage.setItem('venix_current_user_addresses', JSON.stringify(updatedAddresses));
      toast.success('آدرس به صورت محلی ذخیره شد');
      setNewAddress({ province: '', city: '', full_address: '', postal_code: '', phone: '' });
    }
  };

  const handleDeleteAddress = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/auth/me/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      // Ignore backend errors for fallback
    }
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('venix_current_user_addresses', JSON.stringify(updatedAddresses));
    toast.success('آدرس حذف شد');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-white mb-8">حساب کاربری</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center h-fit sticky top-24">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-primary">
              {userData.fullName ? userData.fullName.charAt(0) : <FiUser className="w-10 h-10" />}
            </div>
            
            {userData.businessName && <p className="text-xs text-primary font-bold mb-1">{userData.businessName}</p>}
            <h2 className="text-xl font-bold text-white mb-1">{userData.fullName || 'کاربر مهمان'}</h2>
            <p className="text-sm text-gray-400 mb-2" dir="ltr">{userData.phone}</p>
            
            <span className={`text-xs px-3 py-1 rounded-full mb-6 ${userData.isAdmin ? 'bg-primary/20 text-primary' : (userData.group !== 'NORMAL' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300')}`}>
              {getRoleLabel()}
            </span>
            
            <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 py-3 rounded-xl transition font-bold mb-3">
              <FiEdit2 /> ویرایش پروفایل
            </button>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 py-3 rounded-xl transition font-bold">
              <FiLogOut /> خروج
            </button>
          </div>

          <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-8 min-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FiPackage className="w-5 h-5 text-primary" /> تاریخچه سفارشات</h3>
            {loadingOrders ? (
              <div className="flex justify-center py-12"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span></div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiBox className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">هنوز سفارشی ثبت نکرده‌اید.</p>
                <button onClick={() => navigate('/shop')} className="mt-6 text-primary hover:underline font-bold">بازگشت به فروشگاه</button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const statusColors = {
                    pending_payment: 'bg-yellow-500/20 text-yellow-400',
                    paid: 'bg-blue-500/20 text-blue-400',
                    processing: 'bg-purple-500/20 text-purple-400',
                    delivered: 'bg-green-500/20 text-green-400',
                    cancelled: 'bg-red-500/20 text-red-400',
                    refunded: 'bg-gray-500/20 text-gray-400',
                    completed: 'bg-green-500/20 text-green-400'
                  };
                  const statusLabels = {
                    pending_payment: 'در انتظار پرداخت',
                    paid: 'پرداخت شده',
                    processing: 'در حال پردازش',
                    delivered: 'ارسال شده',
                    cancelled: 'لغو شده',
                    refunded: 'مرجوع شده',
                    completed: 'تکمیل شده'
                  };
                  return (
                    <div key={order.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold">سفارش #{order.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-md ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className="text-primary font-black text-lg">{new Intl.NumberFormat('fa-IR').format(order.total_price)}</span>
                            <span className="text-xs text-gray-500 mr-1">تومان</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                        
                        {/* ✅ NEW: Show ordered items */}
                        {order.items && order.items.length > 0 && (
                          <div className="border-t border-white/5 pt-3 mt-1 space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">{item.product_title || item.product_title_snapshot} <span className="text-gray-500 text-xs">(x{item.quantity})</span></span>
                                <span className="text-gray-400">{new Intl.NumberFormat('fa-IR').format(item.unit_price * item.quantity)} تومان</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-[#1a1a1a] z-10">
              <h2 className="text-xl font-bold text-white">ویرایش اطلاعات</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
            </div>
            <div className="flex border-b border-white/10 px-6">
              <button onClick={() => setActiveTab('info')} className={`py-4 px-6 font-bold transition ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>اطلاعات فردی</button>
              <button onClick={() => setActiveTab('address')} className={`py-4 px-6 font-bold transition ${activeTab === 'address' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>آدرس‌ها</button>
            </div>
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">نام</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">نام خانوادگی</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" /></div>
                  </div>
                  <button onClick={handleSaveInfo} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition">ذخیره تغییرات</button>
                </div>
              )}
              {activeTab === 'address' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    {addresses.length === 0 ? <p className="text-gray-500 text-center py-4">آدرسی ثبت نشده است.</p> : addresses.map(addr => (
                      <div key={addr.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-start">
                        <div><h4 className="font-bold text-white mb-1">{addr.province}، {addr.city}</h4><p className="text-sm text-gray-400">{addr.full_address} | کد پستی: {addr.postal_code}</p></div>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
                    <h4 className="font-bold text-primary text-sm flex items-center gap-2"><FiPlus /> افزودن آدرس جدید</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="استان" value={newAddress.province} onChange={e => setNewAddress({...newAddress, province: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                      <input type="text" placeholder="شهر" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="کد پستی" value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                      <input type="text" placeholder="شماره تماس (اختیاری)" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                    </div>
                    <textarea placeholder="آدرس کامل" value={newAddress.full_address} onChange={e => setNewAddress({...newAddress, full_address: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none h-20" />
                    <button onClick={handleAddAddress} className="w-full bg-button hover:bg-button/90 text-white font-bold py-2 rounded-lg transition text-sm">ثبت آدرس</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Profile;