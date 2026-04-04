import TileCuttingVisualizer from "./components/TileCuttingVisualizer"; // Điều chỉnh đường dẫn nếu cần

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Component Visualizer mới */}
        <TileCuttingVisualizer />

        {/* Component Tính toán cũ (nếu bạn vẫn muốn giữ nó) */}
        {/* ... (Đoạn mã code page.tsx cũ của bạn) ... */}
      </div>
    </div>
  );
}
