import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';

interface CustomTextModalProps {
  initialText: string;
  onSave: (text: string) => void;
  onClose: () => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  initialText,
  onSave,
  onClose,
}) => {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');

  const handleApply = () => {
    const cleaned = text.trim().replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    if (!cleaned || cleaned.length < 10) {
      setError('自訂文章內容長度至少需 10 個字元');
      return;
    }
    onSave(cleaned);
    onClose();
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div
      id="custom-text-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">自訂練習文章或單字庫</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            貼上你想練習的英文短文、教科書段落、程式碼註解或生字清單：
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste your custom English text here... (e.g. Technology is best when it brings people together.)"
            rows={7}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 scrollbar-thin scrollbar-thumb-slate-700"
          />

          <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
            <span>單字數：{wordCount} | 字元數：{charCount}</span>
            {error && <span className="text-rose-400 font-medium">{error}</span>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Check className="w-4 h-4" />
            套用自訂內容
          </button>
        </div>
      </div>
    </div>
  );
};
