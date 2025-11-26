export default function InputField({ label, type = "text", value, onChange, icon }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>
        <input type={type} value={value} onChange={onChange} className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-orange-500 transition-all"/>
      </div>
    </div>
  );
}
