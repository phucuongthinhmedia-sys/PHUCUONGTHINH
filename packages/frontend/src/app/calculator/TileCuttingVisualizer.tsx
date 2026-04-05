import TileCuttingVisualizer from "./components/TileCuttingVisualizer";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] py-10 px-4 sm:px-8 font-sans pb-24">
      <div className="max-w-[1000px] mx-auto space-y-8">
        {/* Header tinh tế */}
        <div className="text-center mb-8">
          <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight">
            Mô phỏng đường cắt
          </h1>
          <p className="text-[17px] text-[#8E8E93] mt-2 font-medium">
            Trực quan hóa cách bố trí và cắt gạch thực tế
          </p>
        </div>

        {/* Khối bọc Visualizer dạng Apple Card */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E5EA] overflow-hidden p-6 sm:p-8">
          {/* Đặt Component Visualizer của bạn ở đây */}
          <TileCuttingVisualizer />
        </div>
      </div>
    </div>
  );
}
