import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Star, MessageCircle, Edit2, Trash2, Send, CornerDownRight, User } from 'lucide-react';

export function GuestReviews({ hotelId }) {
  const { user, requireAuth } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${hotelId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) fetchComments();
  }, [hotelId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    requireAuth(async () => {
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            hotelId,
            content: newReview,
            rating: newRating
          })
        });
        const data = await res.json();
        if (data.success) {
          setNewReview('');
          setNewRating(5);
          fetchComments();
        } else {
          alert(data.message || 'Có lỗi xảy ra');
        }
      } catch (err) {
        alert('Lỗi kết nối mạng');
      }
    });
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) return;

    requireAuth(async () => {
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            hotelId,
            content: replyText,
            parentId
          })
        });
        const data = await res.json();
        if (data.success) {
          setReplyTo(null);
          setReplyText('');
          fetchComments();
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (id, parentId) => {
    if (!editText.trim()) return;
    
    try {
      const payload = { content: editText };
      if (!parentId) payload.rating = editRating;

      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingId(null);
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rootComments = comments.filter(c => !c.parentId);
  
  if (loading) return <div className="py-8 text-center text-slate-500">Đang tải đánh giá...</div>;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
    ));
  };

  return (
    <div className="mt-12 border-t border-slate-200 pt-10">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-sky-600" /> Đánh giá từ khách hàng
      </h2>

      {/* Main Review Form */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-10 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Chia sẻ trải nghiệm của bạn</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-slate-600">Đánh giá chung:</span>
            <div className="flex gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map(num => (
                <Star 
                  key={num} 
                  onClick={() => setNewRating(num)}
                  className={`w-6 h-6 transition-colors ${num <= newRating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300 hover:text-amber-200'}`} 
                />
              ))}
            </div>
          </div>
          <div className="relative">
             <textarea 
               value={newReview}
               onChange={e => setNewReview(e.target.value)}
               placeholder="Khách sạn như thế nào? Nhân viên có thân thiện không?..."
               className="w-full border border-slate-300 rounded-xl p-4 pr-16 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none h-24"
             />
             <button type="submit" className="absolute right-3 bottom-3 bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-lg transition" title="Gửi đánh giá">
               <Send className="w-4 h-4" />
             </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">* Chỉ những khách hàng đã thanh toán thành công mới có thể gửi đánh giá cho chỗ nghỉ này.</p>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {rootComments.length === 0 ? (
          <div className="text-center py-10 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            Chưa có đánh giá nào. Hãy là người đầu tiên để lại đánh giá!
          </div>
        ) : (
          rootComments.map(comment => {
            const replies = comments.filter(c => c.parentId === comment._id).reverse();
            const isOwner = user && (user.id === comment.userId?._id || user._id === comment.userId?._id || user.role === 'admin');
            const isEditing = editingId === comment._id;

            return (
              <div key={comment._id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                
                {/* Root Comment UI */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-sky-100 border border-slate-100 flex justify-center items-center">
                    {comment.userId?.avatar ? <img src={comment.userId.avatar} className="w-full h-full object-cover"/> : <User className="w-6 h-6 text-sky-600"/>}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-slate-800">{comment.userId?.username || 'Khách ẩn danh'}</h4>
                        <div className="flex items-center gap-1 mt-0.5">{renderStars(comment.rating)}</div>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {isEditing ? (
                      <div className="mt-3 mb-2">
                         <div className="flex items-center gap-1 mb-2">
                           {[1, 2, 3, 4, 5].map(num => (
                             <Star key={num} onClick={() => setEditRating(num)} className={`w-5 h-5 cursor-pointer ${num <= editRating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'}`} />
                           ))}
                         </div>
                         <textarea value={editText} onChange={e => setEditText(e.target.value)} className="w-full border border-sky-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none" rows="3"/>
                         <div className="flex gap-2 justify-end mt-2">
                           <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-md">Hủy</button>
                           <button onClick={() => handleEditSubmit(comment._id, null)} className="text-xs px-3 py-1.5 bg-sky-600 text-white rounded-md font-bold">Lưu thay đổi</button>
                         </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 text-sm mt-3 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    )}

                    <div className="flex gap-4 mt-3 text-xs font-bold text-slate-500">
                      <button onClick={() => { setReplyTo(replyTo === comment._id ? null : comment._id); setReplyText(''); }} className="hover:text-sky-600 flex items-center gap-1">Trả lời</button>
                      {isOwner && !isEditing && (
                        <>
                          <button onClick={() => { setEditingId(comment._id); setEditText(comment.content); setEditRating(comment.rating); }} className="hover:text-amber-500 flex items-center gap-1"><Edit2 className="w-3 h-3"/> Sửa</button>
                          <button onClick={() => handleDelete(comment._id)} className="hover:text-red-500 flex items-center gap-1"><Trash2 className="w-3 h-3"/> Xóa</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reply Input Box */}
                {replyTo === comment._id && (
                  <div className="mt-4 ml-16 flex gap-3 relative animate-in fade-in zoom-in duration-200">
                     <CornerDownRight className="w-5 h-5 text-slate-300 absolute -left-7 top-2" />
                     <input 
                       autoFocus
                       value={replyText} onChange={e => setReplyText(e.target.value)}
                       placeholder="Viết câu trả lời..."
                       className="w-full text-sm border-b-2 border-slate-200 py-2 focus:border-sky-500 outline-none pr-10 bg-transparent"
                     />
                     <button onClick={() => handleSubmitReply(comment._id)} className="text-sky-600 hover:bg-sky-50 p-2 rounded-full absolute right-0">
                       <Send className="w-4 h-4" />
                     </button>
                  </div>
                )}

                {/* Replies Thread */}
                {replies.length > 0 && (
                  <div className="mt-6 ml-6 border-l-2 border-slate-100 pl-6 space-y-6">
                    {replies.map(reply => {
                      const isReplyOwner = user && (user.id === reply.userId?._id || user._id === reply.userId?._id || user.role === 'admin');
                      const childEditing = editingId === reply._id;
                      return (
                        <div key={reply._id} className="relative">
                          <CornerDownRight className="w-5 h-5 text-slate-200 absolute -left-12 top-0" />
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 flex justify-center items-center">
                               {reply.userId?.avatar ? <img src={reply.userId.avatar} className="w-full h-full object-cover"/> : <User className="w-4 h-4 text-slate-400"/>}
                            </div>
                            <div className="flex-grow bg-slate-50/80 p-3 rounded-2xl rounded-tl-sm border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                <h5 className="font-bold text-xs text-slate-800">{reply.userId?.username || 'Khách'}</h5>
                                <span className="text-[10px] text-slate-400">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</span>
                              </div>

                              {childEditing ? (
                                <div className="mt-2">
                                  <input autoFocus value={editText} onChange={e => setEditText(e.target.value)} className="w-full border-b border-sky-300 py-1 text-sm outline-none bg-transparent mb-2" />
                                  <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingId(null)} className="text-[10px] uppercase font-black px-2 py-1 text-slate-500">Hủy</button>
                                    <button onClick={() => handleEditSubmit(reply._id, comment._id)} className="text-[10px] uppercase font-black px-2 py-1 text-sky-600">Lưu</button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-600 text-sm">{reply.content}</p>
                              )}
                              
                              <div className="flex gap-3 mt-2 text-[10px] font-bold text-slate-400">
                                {isReplyOwner && !childEditing && (
                                  <>
                                    <button onClick={() => { setEditingId(reply._id); setEditText(reply.content); }} className="hover:text-amber-500">Sửa</button>
                                    <button onClick={() => handleDelete(reply._id)} className="hover:text-red-500">Xóa</button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

              </div>
            )
          })
        )}
      </div>

    </div>
  );
}
