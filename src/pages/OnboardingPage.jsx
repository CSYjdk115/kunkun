import { useState } from 'react';
import { createFamily, joinFamily } from '../db/supabase';
import { PiggyBank, ArrowRight, Copy, LogIn } from 'lucide-react';

export default function OnboardingPage({ onDone }) {
  const [mode, setMode] = useState(null); // null | 'create' | 'join'
  const [code, setCode] = useState('');
  const [familyCode, setFamilyCode] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await createFamily();
      setFamilyCode(data.code);
    } catch (err) {
      setError('创建失败，请检查网络连接');
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      await joinFamily(code.trim());
      onDone();
    } catch (err) {
      setError('家庭码无效，请检查后重试');
    }
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(familyCode);
  };

  // Created - show code
  if (familyCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <span className="text-6xl bounce-in">🐷</span>
        <h2 className="text-xl font-bold text-pink-500 mt-4">家庭创建成功！</h2>
        <p className="text-sm text-gray-500 mt-2">把这个码分享给老婆</p>

        <div className="bg-pink-50 rounded-2xl px-8 py-4 mt-4">
          <span className="text-3xl font-bold tracking-[0.3em] text-pink-500">{familyCode}</span>
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 mt-3 text-sm text-pink-500 font-medium active:scale-95 transition-all"
        >
          <Copy size={14} /> 复制家庭码
        </button>

        <button
          onClick={onDone}
          className="w-full mt-8 py-3.5 bg-pink-400 text-white rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
        >
          开始记账 <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <span className="text-6xl float">🐷</span>
      <h1 className="text-xl font-bold text-pink-500 mt-4">猪猪记账</h1>
      <p className="text-sm text-gray-400 mt-1">两人一起记账，数据实时同步</p>

      {!mode ? (
        <div className="w-full mt-10 space-y-3">
          <button
            onClick={() => setMode('create')}
            className="w-full py-4 bg-pink-400 text-white rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
          >
            <PiggyBank size={18} /> 创建新家庭
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full py-4 bg-pink-50 text-pink-500 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={18} /> 加入已有家庭
          </button>
        </div>
      ) : mode === 'create' ? (
        <div className="w-full mt-10">
          <p className="text-sm text-gray-500 mb-6">确认创建新的家庭账本</p>
          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-4 bg-pink-400 text-white rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-pink-200 disabled:opacity-50"
          >
            {loading ? '创建中...' : '确认创建'}
          </button>
          <button
            onClick={() => { setMode(null); setError(''); }}
            className="w-full mt-3 py-3 text-gray-400 text-sm"
          >返回</button>
        </div>
      ) : (
        <div className="w-full mt-10">
          <p className="text-sm text-gray-500 mb-2">输入家庭码加入</p>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="例如 ABC123"
            maxLength={6}
            className="w-full text-center text-2xl font-bold tracking-[0.3em] py-3 bg-pink-50 rounded-2xl outline-none text-pink-500 placeholder-pink-200"
            autoFocus
          />
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
          <button
            onClick={handleJoin}
            disabled={loading || code.trim().length < 6}
            className="w-full mt-6 py-4 bg-pink-400 text-white rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-pink-200 disabled:opacity-50"
          >
            {loading ? '加入中...' : '加入'}
          </button>
          <button
            onClick={() => { setMode(null); setError(''); setCode(''); }}
            className="w-full mt-3 py-3 text-gray-400 text-sm"
          >返回</button>
        </div>
      )}
    </div>
  );
}
